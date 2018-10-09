const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // GetCustomer
  router.get('/:customerId', async (req, res, next) => {
    try {
      const results = await knex(res.locals.dbTable).select()
        .where({
          customer_id: req.params.customerId
        });

      if (results.length === 0) {
        return res.status(404).json({
          status: 404,
          code: 'customer/customer-not-found',
          message: `Customer ${req.params.customerId} not found.`
        })
      }

      const data = results[0];
      delete data.id;
      delete data.billing_default;

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
