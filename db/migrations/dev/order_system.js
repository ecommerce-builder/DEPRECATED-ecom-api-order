exports.up = function(knex, Promise) {
  return knex.schema.createTable('customers', table => {
    table.increments().primary();
    table.uuid('customer_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('firstname', 255);
    table.string('lastname', 255);
    table.bigInteger('billing_default')
      .unsigned()
      .index()
      .nullable()
      .defaultTo(null);
    table.jsonb('metadata');
    table.timestamp('created').defaultTo(knex.fn.now());
    table.timestamp('modified').defaultTo(knex.fn.now());
    table.unique('customer_id');
  })
  .createTable('addresses', table => {
    table.increments().primary();
    table.uuid('address_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.bigInteger('customer_fk')
      .unsigned()
      .notNull()
      .index()
      .references('id').inTable('customers');
    table.enu('type', ['billing', 'shipping']);
    table.string('contact_name', 255);
    table.string('address_line_1', 255);
    table.string('address_line_2', 255);
    table.string('city', 255);
    table.string('state', 255);
    table.string('zip', 16);
    table.string('country', 2);
    table.jsonb('metadata');
    table.timestamp('created').defaultTo(knex.fn.now());
    table.timestamp('modified').defaultTo(knex.fn.now());
  })
  .table('customers', function (table) {
    table.foreign('billing_default').references('id').inTable('addresses');
  })
  .createTable('products', table => {
    table.increments().primary();
    table.uuid('product_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('sku', 255);
    table.jsonb('images');
    table.jsonb('metadata');

    table.timestamp('created').defaultTo(knex.fn.now());
  })
  .createTable('orders', table => {
    table.increments().primary();
    table.uuid('order_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.jsonb('billing_address');
    table.jsonb('shipping_address');
    table.jsonb('order_items');
    table.jsonb('metadata');
    table.timestamp('created').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('customers', function(table) {
    table.dropForeign('billing_default');
    console.log('dropping FK');
  }).then(function(result) {
    return knex.schema
      .dropTable('orders')
      .dropTable('products')
      .dropTable('addresses')
      .dropTable('customers');
  });
};
