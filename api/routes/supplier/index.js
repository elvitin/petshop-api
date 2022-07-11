const router = require('express').Router();
const supplierTable = require('./supplierTable');
const Supplier = require('./supplier');
const { SupplierSerializer } = require('../../Serializer');

router.get('/', async (_, res) => {
  /**
   * trocar linha 9 para fazer comunicação apenas com o objeto supplier, e não com o objeto tabela de supplier
   */
  const results = await supplierTable.selectAll();

  // res.send(JSON.stringify(results));
  // res.status(200).json(results);

  const supplierSerializer = new SupplierSerializer(
    res.getHeader('Content-Type')
  );
  res.status(200).send(supplierSerializer.serialize(results));
});

router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    const supplier = new Supplier(data);
    await supplier.create();

    // res.status(201).send(JSON.stringify(supplier));
    // res.status(201).json(supplier);

    const supplierSerializer = new SupplierSerializer(
      res.getHeader('Content-Type')
    );
    res.status(201).send(supplierSerializer.serialize(supplier));
  } catch (error) {
    // res.status(400).json({ error: error.message });
    next(error);
  }
});

router.get('/:supplierId', async (req, res, next) => {
  try {
    const id = req.params.supplierId;
    const supplier = new Supplier({ id: id });
    await supplier.get();

    // res.status(200).json(supplier);
    const supplierSerializer = new SupplierSerializer(
      res.getHeader('Content-Type', [
        'email',
        'createdAt',
        'updatedAt',
        'version'
      ])
    );
    res.status(200).send(supplierSerializer.serialize(supplier));
  } catch (error) {
    next(error);
  }
});

router.put('/:supplierId', async (req, res, next) => {
  try {
    const id = req.params.supplierId;
    let requisitionSupplier = req.body;
    requisitionSupplier = Object.assign({}, requisitionSupplier, { id: id });
    const updatedSupplier = new Supplier(requisitionSupplier);
    await updatedSupplier.update();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.delete('/:supplierId', async (req, res, next) => {
  try {
    const id = req.params.supplierId;
    const supplier = new Supplier({ id: id });
    await supplier.get();
    await supplier.delete();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
