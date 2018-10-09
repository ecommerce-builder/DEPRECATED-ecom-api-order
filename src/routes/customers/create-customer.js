const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // CreateCustomer
  router.post('/', async (req, res, next) => {
    try {
      const results = await knex(res.locals.dbTable).insert({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        metadata: req.body.metadata
      })
      .returning('*');

      const data = results[0];
      delete data.id;
      delete data.modified;
      delete data.billing_default;
      delete data.modified;
      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
