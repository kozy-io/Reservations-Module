
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const filename = path.join(__dirname, '../../csv/postgres/locations.csv');
const writeStream = fs.createWriteStream(filename);
const encoding = 'utf8';

function generateLocationsData() {
  let i = 10000;

  function write() {
    let ok = true;
    do {
      let zipcode = parseInt(faker.address.zipCode());
      let country = 'United States';
      let currency = 'USD';
      let localtax = faker.finance.amount(0.2, 0.7, 2)
   
      i--;
      if (i === 0) {
        data = `${i},${zipcode}, ${country}, ${currency}, ${localtax}\n`
        writeStream.write(data, encoding);
      } else {
        data = `${i},${zipcode}, ${country}, ${currency}, ${localtax}\n`       
        ok = writeStream.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writeStream.once('drain', write);
    } 
  }
  write();
}

generateLocationsData();

