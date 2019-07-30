
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const filename = path.join(__dirname, '../../csv/cassandra/custom.csv');
const writeStream = fs.createWriteStream(filename);
const encoding = 'utf8';

function generateCustomData() {
  let i = 1000000;

  function write() {
    let ok = true;
    do {
      let listing_id = i;
      let booked_date = String(faker.date.between('2019-08-01', '2020-08-01'));
      let booked_week_day = booked_date.slice(0,3);
      let booked_month = booked_date.slice(4,7);
      let booked_day = booked_date.slice(8,10);
      let booked_year = booked_date.slice(11,16);
      let custom_markup = faker.finance.amount(0.2, 0.5, 2)
   
      i--;
      if (i === 0) {
        data = `${listing_id},${booked_year},${booked_month}, ${booked_day}, ${booked_week_day}, ${booked_date},${custom_markup}, ${i}\n`
        writeStream.write(data, encoding);
      } else {
        data = `${listing_id},${booked_year},${booked_month}, ${booked_day}, ${booked_week_day}, ${booked_date},${custom_markup}, ${i}\n`     
        ok = writeStream.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writeStream.once('drain', write);
    } 
  }
  write();
}

generateCustomData();

