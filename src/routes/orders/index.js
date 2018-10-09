const express = require('express');

module.exports = knex => {
  const router = express.Router();

  router.use((req, res, next) => {
    res.locals.vendorId = 'spyvendor';
    res.locals.dbTable = 'orders';
    next();
  });

  router.use(require('./place-order')(knex));

  return router;
};
