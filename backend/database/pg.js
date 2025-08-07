const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const query = (text, params, client) => {
  if (client) {
    return client.query(text, params);
  } else {
    return pool.query(text, params);
  }
};

module.exports = {
  pool,
  query,
};
