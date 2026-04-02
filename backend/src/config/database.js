const { Sequelize } = require('sequelize');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/emlak.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false
  }
});

module.exports = sequelize;
