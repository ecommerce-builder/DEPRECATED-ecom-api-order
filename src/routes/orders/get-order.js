const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // GetOrder
  router.get('/:order_id', async (req, res, next) => {
    try {
      await knex(res.locals.dbTable).select({
        order_id
      });

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  });

  return router;
};
