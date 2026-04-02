const express = require('express');
const router = express.Router();
const { Setting } = require('../models');
const auth = require('../middleware/auth');
const { uploadLogo } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// GET /api/settings - Get all settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    // Default settings
    const defaults = {
      siteName: 'Emlak Sitesi',
      siteDescription: 'Gayrimenkul danışmanlık hizmetleri',
      logo: '',
      favicon: '',
      primaryColor: '#2563eb',
      footerText: '© 2024 Emlak Sitesi. Tüm hakları saklıdır.'
    };

    res.json({ settings: { ...defaults, ...settingsObj } });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// PUT /api/settings - Update settings (admin)
router.put('/', auth, async (req, res) => {
  try {
    const updates = req.body;

    for (const [key, value] of Object.entries(updates)) {
      const setting = await Setting.findOne({ where: { key } });
      if (setting) {
        await setting.update({ value });
      } else {
        await Setting.create({ key, value });
      }
    }

    // Return all settings
    const settings = await Setting.findAll();
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });

    res.json({ settings: settingsObj });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Sunucu hatası.' });
  }
});

// POST /api/settings/logo - Upload logo (admin)
router.post('/logo', auth, (req, res) => {
  uploadLogo(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Dosya yüklenmedi.' });
      }

      // Delete old logo
      const oldLogo = await Setting.findOne({ where: { key: 'logo' } });
      if (oldLogo && oldLogo.value) {
        const uploadDir = path.join(__dirname, '../../uploads');
        const oldPath = path.join(uploadDir, oldLogo.value.replace('/uploads/', ''));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const logoUrl = `/uploads/logo/${req.file.filename}`;

      const setting = await Setting.findOne({ where: { key: 'logo' } });
      if (setting) {
        await setting.update({ value: logoUrl });
      } else {
        await Setting.create({ key: 'logo', value: logoUrl });
      }

      res.json({ logo: logoUrl });
    } catch (error) {
      console.error('Upload logo error:', error);
      res.status(500).json({ error: 'Sunucu hatası.' });
    }
  });
});

module.exports = router;
