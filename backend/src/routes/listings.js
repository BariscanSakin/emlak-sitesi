const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const slugify = require('slugify');
const { body, validationResult, query } = require('express-validator');
const { Listing, ListingImage, ListingFeature } = require('../models');
const auth = require('../middleware/auth');
const { uploadListingImages } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// GET /api/listings - Public listing list with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      status,
      type,
      city,
      district,
      rooms,
      minPrice,
      maxPrice,
      minSqm,
      maxSqm,
      search,
      sort = 'newest',
      featured
    } = req.query;

    const where = { isActive: true };

    if (status) where.status = status;
    if (type) where.type = type;
    if (city) where.city = city;
    if (district) where.district = district;
    if (rooms) where.rooms = rooms;
    if (featured === 'true') where.isFeatured = true;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (minSqm || maxSqm) {
      where.sqm = {};
      if (minSqm) where.sqm[Op.gte] = parseFloat(minSqm);
      if (maxSqm) where.sqm[Op.lte] = parseFloat(maxSqm);
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { district: { [Op.like]: `%${search}%` } }
      ];
    }

    let order;
    switch (sort) {
      case 'price_asc': order = [['price', 'ASC']]; break;
      case 'price_desc': order = [['price', 'DESC']]; break;
      case 'oldest': order = [['createdAt', 'ASC']]; break;
      default: order = [['createdAt', 'DESC']];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { rows: listings, count: total } = await Listing.findAndCountAll({
      where,
      include: [
        { model: ListingImage, as: 'images', attributes: ['id', 'imageUrl', 'sortOrder'] }
      ],
      order,
      limit: parseInt(limit),
      offset,
      distinct: true
    });

    res.json({
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('List listings error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// GET /api/listings/featured - Featured listings
router.get('/featured', async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { isActive: true, isFeatured: true },
      include: [
        { model: ListingImage, as: 'images', attributes: ['id', 'imageUrl', 'sortOrder'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 6
    });
    res.json({ listings });
  } catch (error) {
    console.error('Featured listings error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// GET /api/listings/filters - Get available filter options
router.get('/filters', async (req, res) => {
  try {
    const cities = await Listing.findAll({
      attributes: ['city'],
      where: { isActive: true, city: { [Op.ne]: null } },
      group: ['city'],
      raw: true
    });
    const types = await Listing.findAll({
      attributes: ['type'],
      where: { isActive: true },
      group: ['type'],
      raw: true
    });
    const roomOptions = await Listing.findAll({
      attributes: ['rooms'],
      where: { isActive: true, rooms: { [Op.ne]: null } },
      group: ['rooms'],
      raw: true
    });

    res.json({
      cities: cities.map(c => c.city).filter(Boolean),
      types: types.map(t => t.type).filter(Boolean),
      rooms: roomOptions.map(r => r.rooms).filter(Boolean)
    });
  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// GET /api/listings/all - Admin: all listings including inactive
router.get('/all', auth, async (req, res) => {
  try {
    const listings = await Listing.findAll({
      include: [
        { model: ListingImage, as: 'images', attributes: ['id', 'imageUrl', 'sortOrder'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ listings });
  } catch (error) {
    console.error('All listings error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// GET /api/listings/:slug - Single listing by slug
router.get('/:slug', async (req, res) => {
  try {
    const listing = await Listing.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: ListingImage, as: 'images', attributes: ['id', 'imageUrl', 'sortOrder'], order: [['sortOrder', 'ASC']] },
        { model: ListingFeature, as: 'features', attributes: ['id', 'featureName', 'featureValue'] }
      ]
    });

    if (!listing) {
      return res.status(404).json({ error: 'İlan bulunamadı.' });
    }

    res.json({ listing });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// POST /api/listings - Create listing (admin)
router.post('/', auth, [
  body('title').notEmpty().withMessage('Başlık gerekli.'),
  body('price').isFloat({ min: 0 }).withMessage('Geçerli bir fiyat girin.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = req.body;
    let baseSlug = slugify(data.title, { lower: true, strict: true, locale: 'tr' });
    let slug = baseSlug;
    let counter = 1;
    while (await Listing.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const listing = await Listing.create({ ...data, slug });

    // Handle features if provided
    if (data.features && Array.isArray(data.features)) {
      for (const feature of data.features) {
        if (feature.featureName && feature.featureValue) {
          await ListingFeature.create({
            listingId: listing.id,
            featureName: feature.featureName,
            featureValue: feature.featureValue
          });
        }
      }
    }

    const fullListing = await Listing.findByPk(listing.id, {
      include: [
        { model: ListingImage, as: 'images' },
        { model: ListingFeature, as: 'features' }
      ]
    });

    res.status(201).json({ listing: fullListing });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// PUT /api/listings/:id - Update listing (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'İlan bulunamadı.' });
    }

    const data = req.body;

    // Update slug if title changed
    if (data.title && data.title !== listing.title) {
      let baseSlug = slugify(data.title, { lower: true, strict: true, locale: 'tr' });
      let slug = baseSlug;
      let counter = 1;
      while (await Listing.findOne({ where: { slug, id: { [Op.ne]: listing.id } } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      data.slug = slug;
    }

    await listing.update(data);

    // Handle features update if provided
    if (data.features && Array.isArray(data.features)) {
      await ListingFeature.destroy({ where: { listingId: listing.id } });
      for (const feature of data.features) {
        if (feature.featureName && feature.featureValue) {
          await ListingFeature.create({
            listingId: listing.id,
            featureName: feature.featureName,
            featureValue: feature.featureValue
          });
        }
      }
    }

    const fullListing = await Listing.findByPk(listing.id, {
      include: [
        { model: ListingImage, as: 'images' },
        { model: ListingFeature, as: 'features' }
      ]
    });

    res.json({ listing: fullListing });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// DELETE /api/listings/:id - Delete listing (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findByPk(req.params.id, {
      include: [{ model: ListingImage, as: 'images' }]
    });
    if (!listing) {
      return res.status(404).json({ error: 'İlan bulunamadı.' });
    }

    // Delete image files
    const uploadDir = path.join(__dirname, '../../uploads');
    for (const image of listing.images) {
      const filePath = path.join(uploadDir, image.imageUrl.replace('/uploads/', ''));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await listing.destroy();
    res.json({ message: 'İlan silindi.' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// POST /api/listings/:id/images - Upload images (admin)
router.post('/:id/images', auth, (req, res) => {
  uploadListingImages(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const listing = await Listing.findByPk(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: 'İlan bulunamadı.' });
      }

      const images = [];
      const maxOrder = await ListingImage.max('sortOrder', { where: { listingId: listing.id } }) || 0;

      for (let i = 0; i < req.files.length; i++) {
        const image = await ListingImage.create({
          listingId: listing.id,
          imageUrl: `/uploads/listings/${req.files[i].filename}`,
          sortOrder: maxOrder + i + 1
        });
        images.push(image);
      }

      res.status(201).json({ images });
    } catch (error) {
      console.error('Upload images error:', error);
      res.status(500).json({ error: 'Sunucu hatası.' });
    }
  });
});

// DELETE /api/listings/:id/images/:imageId - Delete image (admin)
router.delete('/:id/images/:imageId', auth, async (req, res) => {
  try {
    const image = await ListingImage.findOne({
      where: { id: req.params.imageId, listingId: req.params.id }
    });

    if (!image) {
      return res.status(404).json({ error: 'Resim bulunamadı.' });
    }

    const uploadDir = process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads');
    const filePath = path.join(uploadDir, image.imageUrl.replace('/uploads/', ''));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await image.destroy();
    res.json({ message: 'Resim silindi.' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

module.exports = router;
