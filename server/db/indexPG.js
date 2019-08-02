const Pool = require('pg-pool');

const pool = new Pool({
  database: 'reservations',
  host: 'localhost',
  user: 'shane',
  port: 5432,
});

pool.connect().then('Postgres connected').catch('error');
module.exports = {
  pool
}