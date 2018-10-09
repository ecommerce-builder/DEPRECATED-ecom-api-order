const express = require('express');

module.exports = knex => {
  const router = express.Router();

  router.use((req, res, next) => {
    res.locals.vendorId = 'spyvendor';
    res.locals.dbTable = 'customers';
    next();
  });

  router.use(require('./create-customer')(knex));
  router.use(require('./get-customer')(knex));
  router.use(require('./addresses')(knex));
  router.use(require('./orders')(knex));

  return router;
};
