const express = require('express');

module.exports = knex => {
  const router = express.Router();

  router.use(require('./create-customer-address')(knex));
  router.use(require('./get-address')(knex));
  router.use(require('./delete-customer-address')(knex));

  return router;
};
