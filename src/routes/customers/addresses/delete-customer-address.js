const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // DeleteCustomer
  router.delete('/:customerId/addresses/:addressId', async (req, res, next) => {
    try {
      const customerId = req.params.customerId;
      const addressId = req.params.addressId;

      const customerFkResults = await knex('customers')
        .select('id')
        .where({
          customer_id: customerId
        });

      if (customerFkResults.length === 0) {
        return res.status(404).json({
          status: 404,
          code: 'customer/customer-not-found',
          message: `Customer ${customerId} not found.`
        });
      }

      const addressResults = await knex('addresses')
        .select('id')
        .where({
          address_id: addressId
        });

      if (addressResults.length === 0) {
        return res.status(404).json({
          status: 404,
          code: 'customer/customer-address-not-found',
          message: `Customer ${customerId} address ${addressId} not found.`
        });
      }

      const customerFkId = customerFkResults[0].id;

      const numAffectedRows = await knex('addresses').delete()
        .where({
          address_id: req.params.addressId,
          customer_fk: customerFkId
        });

      if (numAffectedRows === 0) {
        return res.status(410).json({
          status: 410,
          code: 'customer/customer-address-already-deleted',
          message: `Customer ${req.params.customer_id} address ${req.params.address_id} already deleted.`
        });
      }

      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  return router;
};
