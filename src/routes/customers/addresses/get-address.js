const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // GetCustomerAddress
  router.get('/:customerId/addresses/:addressId', async (req, res, next) => {
    try {
      const customerFkResults = await knex('customers').select(
        'id'
      ).where({
        customer_id: req.params.customerId
      });

      if (customerFkResults.length === 0) {
        return res.status(404).json({
          status: 404,
          code: 'customer/customer-not-found',
          message: `Customer ${req.params.customer_id} not found.`
        });
      }

      const customerFkId = customerFkResults[0].id

      const rows = await knex('addresses').select().where({
        address_id: req.params.addressId,
        customer_fk: customerFkId
      });

      const data = rows[0];
      delete data.id;
      delete data.customer_fk;
      data.customer_id = req.params.customerId;

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
