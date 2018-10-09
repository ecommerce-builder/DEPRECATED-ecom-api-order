'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const customersRouter = require('./routes/customers');
const ordersRouter = require('./routes/orders');

const env = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

module.exports = () => {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({
    origin: true
  }));
  app.use(bodyParser.json());

  app.use('/customers', customersRouter(knex));
  app.use('/orders', ordersRouter(knex));

  app.use(function(err, req, res, next) {
    console.error(err);
    next();
  });

  return app;
};
