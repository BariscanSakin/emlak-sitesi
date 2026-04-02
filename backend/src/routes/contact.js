const express = require('express');
const router = express.Router();
const { ContactInfo } = require('../models');
const auth = require('../middleware/auth');

// GET /api/contact - Get contact info (public)
router.get('/', async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();

    if (!contact) {
      contact = await ContactInfo.create({
        phone: '',
        phone2: '',
        email: '',
        address: '',
        mapCode: '',
        workingHours: '',
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: '',
        whatsapp: ''
      });
    }

    res.json({ contact });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// PUT /api/contact - Update contact info (admin)
router.put('/', auth, async (req, res) => {
  try {
    let contact = await ContactInfo.findOne();

    if (contact) {
      await contact.update(req.body);
    } else {
      contact = await ContactInfo.create(req.body);
    }

    res.json({ contact });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

module.exports = router;
