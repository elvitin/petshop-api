/**
 * DAO
 */

'use strict';
const NotFound = require('../../../errors/NotFound');
const Model = require('./productTableModel');
const instance = require('../../../database');

module.exports = {
  insert(product) {
    return Model.create(product);
  },

  deleteById(productId, supplierId) {
    return Model.destroy({
      where: {
        id: productId,
        supplier: supplierId
      }
    });
  },

  async selectById(productId, supplierId) {
    const occurrence = await Model.findOne({
      where: {
        id: productId,
        supplier: supplierId
      },
      raw: true
    });
    
    if (!occurrence) {
      throw new NotFound('Product not found');
    }

    return occurrence;
  },

  selectAll(supplierId) {
    return Model.findAll({
      where: {
        supplier: supplierId
      },
      raw: true
    });
  },

  updateById(id, dataForUpdate) {
    return Model.update(dataForUpdate, {
      where: id
    });
  },

  subtract(productId, supplierId, field, stock) {
    return instance.transaction(async transac => {
      const product = await Model.findOne({
        where: {
          id: productId,
          supplier: supplierId
        }
      });

      product[field] = stock;
      await product.save();
      return product;
    });
  }
};
