const express = require('express');

module.exports = knex => {
  const router = express.Router();

  // ListOrders
  router.get('/', async (req, res, next) => {
    try {
      const rows = await knex(res.locals.dbTable).select();
      res.status(200).json(rows);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
