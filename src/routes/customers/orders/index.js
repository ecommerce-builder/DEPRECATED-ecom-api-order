const express = require('express');

module.exports = knex => {
  const router = express.Router();

  router.use(require('./get-customer-orders')(knex));

  return router;
};
