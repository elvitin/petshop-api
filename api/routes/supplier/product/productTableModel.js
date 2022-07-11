const Sequelize = require('sequelize');
const instance = require('../../../database');


const columns = {
  title: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.DataTypes.DOUBLE,
    allowNull: false
  },
  stock: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  supplier: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: require('../supplierTableModel'),
      key: 'id'
    }
  }
};

const options = {
  freezeTableName: true,
  tableName: 'product',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  version: 'version'
};

module.exports = instance.define('product', columns, options);
