const db = require('../db/indexPG.js');
const redis = require('redis');
const client = redis.createClient();

client.on('connect', function() {
  console.log('Redis client connected');
});
client.on('error', function (err) {
  console.log('Something went wrong ' + err);
});

const cacheListing = (req, res) => {
  const { listingID } = req.params;
  client.get(listingID, (err, result) => {
    if (result) {
      res.status(200).send(result);
    }
    else {
      db.pool.query('SELECT * FROM listing JOIN locations ON listing.zipcode_id = locations.id WHERE listing.id = $1', [listingID], (err, data) => {
        if(err) {
          res.status(400).send(err);
        }
        else {
          client.setex(listingID, 3600, JSON.stringify(data.rows[0]))
          res.status(200).send(data.rows[0]);
        }
      });
    }
  });
}

const cacheReserved = (req, res) => {
  const { id, month, year } = req.query;
  const reservationParam = [id, month, year];
   
  client.get(reservationParam, (err, result) => {
    if (result) {
      res.status(200).send(result);
    }
    else {
      db.pool.query('SELECT * FROM reserved_date WHERE listing_id = $1 AND booked_month = $2 AND booked_year = $3', [id, month, year], (err, data) => {
        if(err) {
          res.status(400).send(err);
        }
        else {
          const results = data.rows.map(days => Number(days.booked_day));                    
          client.setex([id, month, year], 3600, JSON.stringify(results));
          res.status(200).send(results);
        }
      });
    }
  });
}

module.exports.cacheListing = cacheListing;
module.exports.cacheReserved = cacheReserved;