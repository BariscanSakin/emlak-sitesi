const express = require('express');
const router = express.Router();
const { Page } = require('../models');
const auth = require('../middleware/auth');

// GET /api/pages/:slug - Get page content (public)
router.get('/:slug', async (req, res) => {
  try {
    let page = await Page.findOne({ where: { slug: req.params.slug } });

    if (!page) {
      // Create default page if it doesn't exist
      const defaults = {
        'hakkimizda': { title: 'Hakkımızda', content: '<p>Hakkımızda içeriği henüz eklenmemiştir.</p>' },
        'gizlilik': { title: 'Gizlilik Politikası', content: '<p>Gizlilik politikası içeriği henüz eklenmemiştir.</p>' },
        'kvkk': { title: 'KVKK Aydınlatma Metni', content: '<p>KVKK metni henüz eklenmemiştir.</p>' }
      };

      const def = defaults[req.params.slug];
      if (def) {
        page = await Page.create({ slug: req.params.slug, ...def });
      } else {
        return res.status(404).json({ error: 'Sayfa bulunamadı.' });
      }
    }

    res.json({ page });
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// GET /api/pages - Get all pages (admin)
router.get('/', auth, async (req, res) => {
  try {
    const pages = await Page.findAll({ order: [['slug', 'ASC']] });
    res.json({ pages });
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// PUT /api/pages/:slug - Update page content (admin)
router.put('/:slug', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    let page = await Page.findOne({ where: { slug: req.params.slug } });

    if (page) {
      await page.update({ title, content });
    } else {
      page = await Page.create({
        slug: req.params.slug,
        title: title || req.params.slug,
        content: content || ''
      });
    }

    res.json({ page });
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

module.exports = router;
