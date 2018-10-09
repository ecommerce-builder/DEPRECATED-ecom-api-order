const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // CreateCustomerAddress
  router.post('/:customer_id/addresses', async (req, res, next) => {
    try {
      const customerFkResults = await knex('customers').select(
        'id'
      ).where({
        customer_id: req.params.customer_id
      });

      if (customerFkResults.length === 0) {
        return res.status(404).json({
          status: 404,
          code: 'customer/customer-not-found',
          message: `Customer ${req.params.customer_id} not found.`
        });
      }

      const customerFkId = customerFkResults[0].id;

      const results = await knex('addresses').insert({
        address_id: req.params.customer_id,
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
      }).returning('*');

      let data;
      if (results.length === 1) {
        data = results[0];
      }
      delete data.id;
      delete data.customer_fk;
      delete data.modified;
      data.customer_id = req.params.customer_id;
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
