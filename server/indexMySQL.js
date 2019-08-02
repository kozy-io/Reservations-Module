const faker = require('faker');
const express = require('express');
const path = require('path');
const app = express();
const port = 3006;
const bodyParser = require('body-parser');
const sequelize = require('sequelize');
const db = require('./db/index.js');


app.use(bodyParser());
app.use('/:listingID', express.static(path.resolve(__dirname, '../public/dist')));

app.get('/listing/:listingID', (req, res) => {
  const { listingID } = req.params;

  db.Listing.findOne({
    where: {
      id: listingID,
    },
  }).then(results => res.send(results))
    .catch(error => res.send(error));
});

app.get('/reserved/month/', (req, res) => {
  const { id, month, year } = req.query;
   
  console.log('month query', month); //months are numbers, e.g. 8 or 9
  console.log('year query', year); //years are numb, e.g. 2019

  db.Reserved.findAll({
    attributes: ['date'],
    where: {
      where: sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year),
      $and: sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
      listing_id: id,
    },
  })
  .then((results) => {
    const days = results.map(date => Number(date.date.slice(-2)));

    console.log('days', days) //days [21, 24]
    res.send(days);
  })
    .catch(error => res.send(error));
});

app.get('/custom/month/', (req, res) => {
  const { id, time } = req.query;

  // console.log('time', time.map(date => String(faker.date.between(date, date))));

  db.CustomRates.findAll({
    attributes: ['date', 'price'],
    where: {
      date: time,
      listing_id: id,
    },
  })
    .then(results => res.send(results))
    .catch(error => res.send(error));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
