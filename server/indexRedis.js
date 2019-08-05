require('newrelic');
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const app = express();
const port = 3006;
const bodyParser = require('body-parser');
const db = require('./db/indexPG.js');
const responseTime = require('response-time');
const router = require('./controller/indexRedis.js');

app.use(morgan('dev'));
app.use(responseTime());
app.use(bodyParser());

app.use('/:listingID', express.static(path.resolve(__dirname, '../public/dist')));

app.get('/api/reservations/:listingID', router.cacheListing);

app.get('/api/reservations/reserved/month/', router.cacheReserved);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
