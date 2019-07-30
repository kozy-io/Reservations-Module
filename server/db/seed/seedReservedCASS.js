
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const filename = path.join(__dirname, '../../csv/cassandra/reserved2.csv');
const writeStream = fs.createWriteStream(filename);
const encoding = 'utf8';
let count = 0;


function generateReservedData() {
  let i = 1000000;

  function write() {
    let ok = true;
    do {
      count++;
      let record_id = count;
      let listing_id = i;
      let booked_date = String(faker.date.between('2019-08-01', '2020-08-01'));
      let booked_week_day = booked_date.slice(0,3);
      let booked_month = booked_date.slice(4,7);
      let booked_day = booked_date.slice(8,10);
      let booked_year = booked_date.slice(11,15);
      let users_id = i;

      i--;
      if (i === 0) {
        data = `${listing_id},${booked_year},${booked_month},${booked_day},${booked_date},${booked_week_day},${record_id},${users_id}\n`
        writeStream.write(data, encoding);
      } else {
        data = `${listing_id},${booked_year},${booked_month},${booked_day},${booked_date},${booked_week_day},${record_id},${users_id}\n`
        ok = writeStream.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writeStream.once('drain', write);
    } 
  }
  write();
}

//Generat 10 reserved dates for each listing_id
for(var j = 0; j < 10; j++) {
  generateReservedData();
}

