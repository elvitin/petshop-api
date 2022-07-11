const router = require('express').Router({ mergeParams: true });
const Product = require('./Product');
const { ProductSerializer } = require('../../../Serializer');

const { selectAll } = require('./productTable'); // remover isso daqui, sera chamado do objeto

router.get('/', async (req, res) => {
  /**
   * calling from product object
   */
  const productSerializer = new ProductSerializer(
    res.getHeader('Content-Type'),
    ['price', 'stock', 'supplier', 'createdAt', 'updatedAt', 'version']
  );

  const { id } = req.supplier;
  const products = await selectAll(id);

  res.send(productSerializer.serialize(products));
});

router.get('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { id } = req.supplier;
    const data = {
      id: productId,
      supplier: id
    };
    const product = new Product(data);
    await product.get();

    const productSerializer = new ProductSerializer(
      res.getHeader('Content-Type'),
      ['price', 'stock', 'supplier', 'createdAt', 'updatedAt', 'version']
    );

    res.set('ETag', product.version);
    res.set('Last-Modified', new Date(product.updatedAt).getTime());

    res.send(productSerializer.serialize(product));
  } catch (error) {
    next(error);
  }
});

router.head('/:productId', async (req, res, next) => {
  try {
    
    const { productId } = req.params;
    const { id } = req.supplier;
    const data = {
      id: productId,
      supplier: id
    };
    const product = new Product(data);
    await product.get();

    res.set('ETag', product.version);
    res.set('Last-Modified', new Date(product.updatedAt).getTime());
    console.log('Aqui');
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { id } = req.supplier;
    const { body } = req;
    const data = Object.assign({}, body, { supplier: id });
    const product = new Product(data);
    await product.create();

    const productSerializer = new ProductSerializer(
      res.getHeader('Content-Type')
    );

    res.set('ETag', product.version);
    res.set('Last-Modified', new Date(product.updatedAt).getTime());
    res.set(
      'Location',
      `/api/supplier/${product.supplier}/product/${product.id}`
    );

    res.status(201).send(productSerializer.serialize(product));
  } catch (error) {
    next(error);
  }
});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;
  const { id } = req.supplier;
  const data = { id: productId, supplier: id };
  const product = new Product(data);
  /**
   * adicionar verificação get como no supplier
   */
  await product.delete();
  res.status(204);
  res.end();
});

router.put('/:productId', async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { id } = req.supplier;
    const { body } = req;
    const newProduct = Object.assign({}, body, { id: productId, supplier: id });
    const _newProduct = new Product(newProduct);
    await _newProduct.update();
    await _newProduct.get();

    res.set('ETag', _newProduct.version);
    res.set('Last-Modified', new Date(_newProduct.updatedAt).getTime());

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.patch('/:productId/decrease-stock', async (req, res, next) => {
  try {
    const product = new Product({
      id: req.params.productId,
      supplier: req.supplier.id
    });

    await product.get();

    const { stock } = req.body;
    product.stock = product.stock - stock;
    await product.decreaseStock();
    await product.get();

    res.set('ETag', product.version);
    res.set('Last-Modified', new Date(product.updatedAt).getTime());

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
