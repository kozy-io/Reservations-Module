require('newrelic');
const express = require('express');
const path = require('path');
const app = express();
const port = 3006;
const bodyParser = require('body-parser');
const db = require('./db/indexPG.js');
const responseTime = require('response-time');

app.use(responseTime());

app.use(bodyParser());
app.use('/:listingID', express.static(path.resolve(__dirname, '../public/dist')));

app.get('/api/reservations/:listingID', (req, res) => {
  const { listingID } = req.params;

  db.pool.query('SELECT * FROM listing JOIN locations ON listing.zipcode_id = locations.id WHERE listing.id = $1', [listingID], (err, data) => {
    if(err) {
      res.status(400).send(err);
    }
    else {
      res.status(200).send(data.rows[0]);
    }
  });
});

app.get('/api/reservations/reserved/month/', (req, res) => {
  const { id, month, year } = req.query;

  db.pool.query('SELECT * FROM reserved_date WHERE listing_id = $1 AND booked_month = $2 AND booked_year = $3', [id, month, year], (err, data) => {
    if(err) {
      res.status(400).send(err);
    }
    else {
      const results = data.rows.map(days => Number(days.booked_day))
      res.status(200).send(results);
    }
  });
});

// app.get('/custom/month/', (req, res) => {
//   const { id, time } = req.query;

//   let timeArr = time.map(date => String(faker.date.between(date, date)));

//1.How to query multiple values within timeArr
//2.What's the shape of the results sent back from the query?

//   // db.CustomRates.findAll({
//   //   attributes: ['date', 'price'],
//   //   where: {
//   //     date: timeArr,
//   //     listing_id: id,
//   //   },
//   // })
//   //   .then(results => res.send(results))
//   //   .catch(error => res.send(error));
// });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
