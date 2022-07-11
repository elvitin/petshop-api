const tableModel = require('../routes/supplier/supplierTableModel');

tableModel
  .sync()
  .then(_ => console.log('[ok] Supplier table has been created'))
  .catch(_ => console.log('[error] Fail to create Supplier table'));
