const NotAcceptable = require('./errors/NotAcceptable');
const jsontoxml = require('jsontoxml');

class Serializer {
  #json(data) {
    return JSON.stringify(data);
  }

  #xml(data) {
    let tag = this.singularTag;

    if (Array.isArray(data)) {
      tag = this.pluralTag;
      data = data.map(item => {
        return { [this.singularTag]: item };
      });
    }
    return jsontoxml({ [tag]: data });
  }

  serialize(data) {
    data = this.#filter(data);

    if (this.contentType === 'application/json') {
      return this.#json(data);
    }

    if (this.contentType === 'application/xml') {
      return this.#xml(data);
    }

    throw new NotAcceptable('This data type is not supported');
  }

  #filterProperties(dataOjbect) {
    const newDataObject = {};

    this.publicProps.forEach(prop => {
      if (dataOjbect.hasOwnProperty(prop))
        newDataObject[prop] = dataOjbect[prop];
    });

    return newDataObject;
  }

  #filter(data) {
    return Array.isArray(data)
      ? data.map(item => this.#filterProperties(item))
      : this.#filterProperties(data);
  }
}

class SupplierSerializer extends Serializer {
  constructor(contentType, extraProps) {
    super();
    this.contentType = contentType;
    this.publicProps = ['id', 'company', 'category'].concat(extraProps || []);
    this.singularTag = 'supplier';
    this.pluralTag = 'suppliers';
  }
}

class ProductSerializer extends Serializer {
  constructor(contentType, extraProps) {
    super();
    this.contentType = contentType;
    this.publicProps = ['id', 'title'].concat(extraProps || []);
    this.singularTag = 'product';
    this.pluralTag = 'products';
  }
}

class ErrorSerializer extends Serializer {
  constructor(contentType, extraProps) {
    super();
    this.contentType = contentType;
    this.publicProps = ['idError', 'message'].concat(extraProps || []);
    this.singularTag = 'error';
    this.pluralTag = 'errors';

  }
}

module.exports = {
  Serializer: Serializer,
  SupplierSerializer: SupplierSerializer,
  ProductSerializer: ProductSerializer,
  ErrorSerializer: ErrorSerializer,
  acceptedFormats: ['application/json', 'application/xml']
};
