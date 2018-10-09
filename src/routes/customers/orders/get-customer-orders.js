const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // GetCustomerOrders
  router.get('/:customer_id/orders', async (req, res, next) => {
    try {
      const rows = await knex(res.locals.dbTable).select({
        firstname: req.body.firstname,
        lastname: req.body.lastname
      });

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  });

  return router;
};
