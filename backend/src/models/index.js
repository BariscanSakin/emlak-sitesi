const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// ============ USER MODEL ============
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'admin' }
});

// ============ LISTING MODEL ============
const Listing = sequelize.define('Listing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: { type: DataTypes.TEXT },
  sqm: { type: DataTypes.FLOAT },
  price: { type: DataTypes.FLOAT },
  currency: { type: DataTypes.STRING, defaultValue: 'TL' },
  status: { type: DataTypes.STRING, defaultValue: 'satilik' }, // satilik, kiralik
  type: { type: DataTypes.STRING, defaultValue: 'daire' }, // daire, villa, arsa, isyeri, etc
  rooms: { type: DataTypes.STRING }, // 1+1, 2+1, 3+1 etc
  bathrooms: { type: DataTypes.INTEGER },
  floor: { type: DataTypes.STRING },
  totalFloors: { type: DataTypes.INTEGER },
  buildingAge: { type: DataTypes.INTEGER },
  heating: { type: DataTypes.STRING },
  furnished: { type: DataTypes.STRING, defaultValue: 'hayir' },
  city: { type: DataTypes.STRING },
  district: { type: DataTypes.STRING },
  neighborhood: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  mapCode: { type: DataTypes.TEXT },
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// ============ LISTING IMAGE MODEL ============
const ListingImage = sequelize.define('ListingImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  listingId: { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.STRING, allowNull: false },
  sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// ============ LISTING FEATURE MODEL ============
const ListingFeature = sequelize.define('ListingFeature', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  listingId: { type: DataTypes.INTEGER, allowNull: false },
  featureName: { type: DataTypes.STRING, allowNull: false },
  featureValue: { type: DataTypes.STRING, allowNull: false }
});

// ============ PAGE MODEL ============
const Page = sequelize.define('Page', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT }
});

// ============ CONTACT INFO MODEL ============
const ContactInfo = sequelize.define('ContactInfo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phone: { type: DataTypes.STRING },
  phone2: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  mapCode: { type: DataTypes.TEXT },
  workingHours: { type: DataTypes.STRING },
  facebook: { type: DataTypes.STRING },
  instagram: { type: DataTypes.STRING },
  twitter: { type: DataTypes.STRING },
  youtube: { type: DataTypes.STRING },
  whatsapp: { type: DataTypes.STRING }
});

// ============ BLOG MODEL ============
const Blog = sequelize.define('Blog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  content: { type: DataTypes.TEXT },
  excerpt: { type: DataTypes.TEXT },
  coverImage: { type: DataTypes.STRING },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// ============ SETTING MODEL ============
const Setting = sequelize.define('Setting', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.STRING, unique: true, allowNull: false },
  value: { type: DataTypes.TEXT }
});

// ============ ASSOCIATIONS ============
Listing.hasMany(ListingImage, { foreignKey: 'listingId', as: 'images', onDelete: 'CASCADE' });
ListingImage.belongsTo(Listing, { foreignKey: 'listingId' });

Listing.hasMany(ListingFeature, { foreignKey: 'listingId', as: 'features', onDelete: 'CASCADE' });
ListingFeature.belongsTo(Listing, { foreignKey: 'listingId' });

module.exports = {
  sequelize,
  User,
  Listing,
  ListingImage,
  ListingFeature,
  Page,
  ContactInfo,
  Blog,
  Setting
};
