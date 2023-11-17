const { Pool } = require('pg');

const pool = new Pool({
  user: 'cyberlive',
  host: 'localhost',
  database: 'cyberlive',
  password: 'cyberlive',
  port: 5432,
});

module.exports = pool;
