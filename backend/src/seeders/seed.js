require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, User, Page, ContactInfo, Setting } = require('../models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced (tables recreated).');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      username: 'admin',
      email: 'admin@emlak.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created: admin / admin123');

    // Create default pages
    await Page.bulkCreate([
      {
        slug: 'hakkimizda',
        title: 'Hakkımızda',
        content: '<h2>Biz Kimiz?</h2><p>Emlak sektöründe uzun yıllara dayanan deneyimimizle, müşterilerimize en kaliteli gayrimenkul danışmanlık hizmetini sunmaktayız.</p><p>Profesyonel ekibimiz ve geniş portföyümüzle hayalinizdeki evi bulmanıza yardımcı oluyoruz.</p>'
      },
      {
        slug: 'gizlilik',
        title: 'Gizlilik Politikası',
        content: '<p>Gizlilik politikası içeriği buraya eklenecektir.</p>'
      },
      {
        slug: 'kvkk',
        title: 'KVKK Aydınlatma Metni',
        content: '<p>KVKK aydınlatma metni içeriği buraya eklenecektir.</p>'
      }
    ]);
    console.log('Default pages created.');

    // Create default contact info
    await ContactInfo.create({
      phone: '+90 (212) 555 00 00',
      phone2: '+90 (532) 555 00 00',
      email: 'info@emlaksitesi.com',
      address: 'Örnek Mahallesi, Emlak Caddesi No:1, İstanbul',
      mapCode: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192697.79327595866!2d28.871754!3d41.005495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa7040068086b%3A0xe1ccfe98bc01b0d0!2zxLBzdGFuYnVs!5e0!3m2!1str!2str!4v1" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
      workingHours: 'Pazartesi - Cumartesi: 09:00 - 18:00',
      whatsapp: '905325550000'
    });
    console.log('Default contact info created.');

    // Create default settings
    await Setting.bulkCreate([
      { key: 'siteName', value: 'Emlak Sitesi' },
      { key: 'siteDescription', value: 'Gayrimenkul danışmanlık hizmetleri' },
      { key: 'logo', value: '' },
      { key: 'primaryColor', value: '#2563eb' },
      { key: 'footerText', value: '© 2024 Emlak Sitesi. Tüm hakları saklıdır.' }
    ]);
    console.log('Default settings created.');

    console.log('\nSeed completed successfully!');
    console.log('Admin credentials: admin / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
