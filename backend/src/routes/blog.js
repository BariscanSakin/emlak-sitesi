const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const slugify = require('slugify');
const { body, validationResult } = require('express-validator');
const { Blog } = require('../models');
const auth = require('../middleware/auth');
const { uploadBlogCover } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// GET /api/blog - Public blog list with search
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 9, search } = req.query;
    const where = { isPublished: true };

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows: blogs, count: total } = await Blog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset,
      attributes: ['id', 'title', 'slug', 'excerpt', 'coverImage', 'createdAt']
    });

    res.json({
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('List blogs error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// GET /api/blog/all - Admin: all blogs
router.get('/all', auth, async (req, res) => {
  try {
    const blogs = await Blog.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ blogs });
  } catch (error) {
    console.error('All blogs error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// GET /api/blog/:slug - Single blog post
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ where: { slug: req.params.slug } });
    if (!blog) {
      return res.status(404).json({ error: 'Blog yazısı bulunamadı.' });
    }
    res.json({ blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// POST /api/blog - Create blog (admin)
router.post('/', auth, (req, res) => {
  uploadBlogCover(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { title, content, excerpt, isPublished } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Başlık gerekli.' });
      }

      let baseSlug = slugify(title, { lower: true, strict: true, locale: 'tr' });
      let slug = baseSlug;
      let counter = 1;
      while (await Blog.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      const blogData = {
        title,
        slug,
        content: content || '',
        excerpt: excerpt || '',
        isPublished: isPublished === 'true' || isPublished === true
      };

      if (req.file) {
        blogData.coverImage = `/uploads/blog/${req.file.filename}`;
      }

      const blog = await Blog.create(blogData);
      res.status(201).json({ blog });
    } catch (error) {
      console.error('Create blog error:', error);
      res.status(500).json({ error: 'Sunucu hatası.' });
    }
  });
});

// PUT /api/blog/:id - Update blog (admin)
router.put('/:id', auth, (req, res) => {
  uploadBlogCover(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const blog = await Blog.findByPk(req.params.id);
      if (!blog) {
        return res.status(404).json({ error: 'Blog yazısı bulunamadı.' });
      }

      const { title, content, excerpt, isPublished } = req.body;
      const updateData = {};

      if (title !== undefined) {
        updateData.title = title;
        if (title !== blog.title) {
          let baseSlug = slugify(title, { lower: true, strict: true, locale: 'tr' });
          let slug = baseSlug;
          let counter = 1;
          while (await Blog.findOne({ where: { slug, id: { [Op.ne]: blog.id } } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
          }
          updateData.slug = slug;
        }
      }

      if (content !== undefined) updateData.content = content;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (isPublished !== undefined) updateData.isPublished = isPublished === 'true' || isPublished === true;

      if (req.file) {
        // Delete old cover image
        if (blog.coverImage) {
          const uploadDir = path.join(__dirname, '../../uploads');
          const oldPath = path.join(uploadDir, blog.coverImage.replace('/uploads/', ''));
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        updateData.coverImage = `/uploads/blog/${req.file.filename}`;
      }

      await blog.update(updateData);
      res.json({ blog });
    } catch (error) {
      console.error('Update blog error:', error);
      res.status(500).json({ error: 'Sunucu hatası.' });
    }
  });
});

// DELETE /api/blog/:id - Delete blog (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog yazısı bulunamadı.' });
    }

    // Delete cover image
    if (blog.coverImage) {
      const uploadDir = path.join(__dirname, '../../uploads');
      const filePath = path.join(uploadDir, blog.coverImage.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await blog.destroy();
    res.json({ message: 'Blog yazısı silindi.' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

module.exports = router;
