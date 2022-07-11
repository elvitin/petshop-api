const supplierTable = require('./supplierTable');
const BadRequest = require('../../errors/BadRequest');

class Supplier {
  constructor({ id, company, email, category, createdAt, updatedAt, version }) {
    this.id = id;
    this.company = company;
    this.email = email;
    this.category = category;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.version = version;
  }

  async create() {

    this.#validate();

    const result = await supplierTable.insert({
      company: this.company,
      email: this.email,
      category: this.category
    });

    this.id = result.id;
    this.createdAt = result.createdAt;
    this.updatedAt = result.updatedAt;
    this.version = result.version;
  }

  async get() {
    const supplier = await supplierTable.selectById(this.id);

    this.company = supplier.company;
    this.email = supplier.email;
    this.category = supplier.category;
    this.createdAt = supplier.createdAt;
    this.updatedAt = supplier.updatedAt;
    this.version = supplier.version;
  }

  async update() {
    await supplierTable.selectById(this.id);

    const properties = ['company', 'email', 'category'];
    const dataForUpdate = {};

    properties.forEach(prop => {
      const value = this[prop];
      if (typeof value === 'string' && value.length) {
        dataForUpdate[prop] = value;
      }
    });

    if (!Object.keys(dataForUpdate).length) {
      throw new BadRequest('No data to update');
    }

    await supplierTable.updateById(this.id, dataForUpdate);
  }

  delete() {
    return supplierTable.deleteById(this.id);
  }

  #validate() {
    const properties = ['company', 'email', 'category'];
    properties.forEach(prop => {
      const value = this[prop];

      if (typeof value !== 'string' || !value.length) {
        // throw new Error(`The propertie '${prop}' is invalid`);
        throw new BadRequest(`The property '${prop}' is invalid`);
      }
    });
  }
}

module.exports = Supplier;
