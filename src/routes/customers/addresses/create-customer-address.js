const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // CreateCustomerAddress
  router.post('/:customerId/addresses', async (req, res, next) => {
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
          message: `Customer ${req.params.customerId} not found.`
        });
      }

      const customerFkId = customerFkResults[0].id;

      const results = await knex('addresses').insert({
        customer_fk: customerFkId,
        type: req.body.type,
        contact_name: req.body.contact_name,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country,
        metadata: req.body.metadata
      }).returning([
        'address_id',
        'contact_name',
        'type',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'zip',
        'country',
        'metadata',
        'created'
      ]);

      if (results.length === 1) {
        const data = results[0];
        data.customer_id = req.params.customerId;
        return res.status(201).json(data);
      }

      res.status(500).json({
        status: 500,
        code: 'customer/create-customer-address-failed',
        message: `Failed to create customer address for customer ${req.params.customerId}.`
      })
    } catch (err) {
      next(err);
    }
  });

  return router;
};
