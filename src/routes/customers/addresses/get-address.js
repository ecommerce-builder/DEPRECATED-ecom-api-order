const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // GetCustomerAddress
  router.post('/:customerId/addresses/:address_id', async (req, res, next) => {
    try {
      const rows = await knex(res.locals.dbTable).select().where({
        customer_id: customerId
      });
      res.status(200).json(rows);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
