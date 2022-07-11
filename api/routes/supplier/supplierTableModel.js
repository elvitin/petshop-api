const Sequelize = require('sequelize');
const instance = require('../../database/index');

const columns = {
  
  company: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.ENUM('pet_food', 'toys'),
    allowNull: false
  }
}

const options = {
  freezeTableName: true,
  tableName: 'supplier',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  version: 'version'
};

module.exports = instance.define('supplier', columns, options);