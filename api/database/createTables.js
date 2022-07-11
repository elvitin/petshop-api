const models = [
  require('../routes/supplier/supplierTableModel'),
  require('../routes/supplier/product/productTableModel')
];

// productTableModel
//   .sync()
//   .then(_ => console.log('[OK] Supplier table has been created'))
//   .catch(_ => console.log('[ERROR] Fail to create Supplier table'));

// supplierTableModel
//   .sync()
//   .then(_ => console.log('[OK] Supplier table has been created'))
//   .catch(_ => console.log('[ERROR] Fail to create Supplier table'));

async function createTables(param) {
  for (const item of param) {
    await item
      .sync()
      .then(_ => console.log('[OK] table has been created'))
      .catch(_ => console.log('[ERROR] Fail to create table'));
  }
}

createTables(models);
