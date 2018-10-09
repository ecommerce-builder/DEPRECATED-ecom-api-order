const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // PlaceOrder
  router.post('/:id', async (req, res, next) => {
    try {
      await knex(res.locals.dbTable).insert({
      });

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  });

  return router;
};
