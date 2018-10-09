module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://postgres:postgres@localhost:5432/order_system',
    migrations: {
      directory: './db/migrations/dev'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    asyncStackTraces: true
  },
  production: {
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 100
    },
    migrations: {
      directory: './db/migrations/prod'
    },
    seeds: {
      directory: './db/seeds/prod'
    }
  }
};
