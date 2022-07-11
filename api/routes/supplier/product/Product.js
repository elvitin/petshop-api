'use strict';
const BadRequest = require('../../../errors/BadRequest');
const {
  insert,
  deleteById,
  selectById,
  updateById,
  subtract
} = require('./productTable');

class Product {
  constructor({
    id,
    title,
    price,
    stock,
    supplier,
    createdAt,
    updatedAt,
    version
  }) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.stock = stock;
    this.supplier = supplier;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.version = version;
  }

  #validate() {
    if (typeof this.title !== 'string' || !this.title.length) {
      throw new BadRequest(`The property title is not valid`);
    }

    if (typeof this.price !== 'number' || !(this.price >= 0)) {
      throw new BadRequest(`The property price is not valid`);
    }

    if (typeof this.stock !== 'number' || !(this.stock >= 0)) {
      throw new BadRequest(`The property stock is not valid`);
    }
  }

  async update() {
    await selectById(this.id, this.supplier);

    const dataForUpdate = {
      title:
        typeof this.title === 'string' && this.title.length > 0
          ? this.title
          : undefined,
      price:
        typeof this.price === 'number' && this.price >= 0.0
          ? this.price
          : undefined,
      stock: typeof this.stock === 'number' ? this.stock : undefined
    };

    const flag = Object.values(dataForUpdate).some(item => item !== undefined);
    if (!flag) {
      throw new BadRequest('The data sent is wrong or missing');
    }

    await updateById({ id: this.id, supplier: this.supplier }, dataForUpdate);
  }

  async create() {
    this.#validate();

    const result = await insert({
      title: this.title,
      price: this.price,
      stock: this.stock,
      supplier: this.supplier
    });

    this.id = result.id;
    this.createdAt = result.createdAt;
    this.updatedAt = result.updatedAt;
    this.version = result.version;
  }

  delete() {
    return deleteById(this.id, this.supplier);
  }

  async get() {
    const product = await selectById(this.id, this.supplier);

    // this.id = id;
    this.title = product.title;
    this.price = product.price;
    this.stock = product.stock;
    // this.supplier = supplier;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
    this.version = product.version;
  }

  /**
   * getAll ainda vai existir
   */

  decreaseStock() {
    return subtract(
      this.id,
      this.supplier,
      'stock',
      this.stock
    )
  }
}

module.exports = Product;
