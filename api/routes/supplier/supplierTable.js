/**
 * DAO
 */
'use strict';
const Model = require('./supplierTableModel');
const NotFound = require('../../errors/NotFound');

module.exports = {
  selectAll() {
    return Model.findAll({ raw: true });
  },

  insert(supplier) {
    return Model.create(supplier);
  },

  async selectById(id) {
    const occurrence = await Model.findOne({
      where: {
        id: id
      }
    });

    if (!occurrence) {
      throw new NotFound('Supplier not found');
    }

    return occurrence;
  },

  updateById(id, dataForUpdate) {
    return Model.update(dataForUpdate, {
      where: { id: id }
    });
  },

  deleteById(id) {
    return Model.destroy({
      where: { id: id }
    });
  }
};
