const Pool = require('pg-pool');

const pool = new Pool({
  //Connect to postgres on ec2
  database: 'kozy',
  host: 'ec2-54-67-66-194.us-west-1.compute.amazonaws.com',
  user: 'power_user',
  port: 5432,
  password: 'hackreactor'

  //Connect to postgres locally
  // database: 'reservations',
  // host: 'localhost',
  // user: 'shane',
  // port: 5432,
});

pool.connect().then('Postgres connected').catch('error');
module.exports = {
  pool
}
