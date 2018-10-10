const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // ListCustomerAddresses
  router.get('/:customerId/addresses', async (req, res, next) => {
    try {
      const customerId = req.params.customerId;
      const customerFkResults = await knex('customers').select(
        'id'
      ).where({
        customer_id: customerId
      });

      if (customerFkResults.length === 0) {
        return res.status(404).json({
          status: 404,
          code: 'customer/customer-not-found',
          message: `Customer ${customerId} not found.`
        });
      }

      const customerFkId = customerFkResults[0].id

      const rows = await knex('addresses').select(
        'address_id',
        'type',
        'contact_name',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip',
        'country',
        'metadata',
        'created',
        'modified'
      ).orderBy('created', 'desc').where({
        customer_fk: customerFkId
      });

      res.status(200).json(rows.map(o => {
        o.customer_id = customerId
        return o;
      }));
    } catch (err) {
      next(err);
    }
  });

  return router;
};
