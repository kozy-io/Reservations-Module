
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const filename = path.join(__dirname, '../csv/users.csv');
const writeStream = fs.createWriteStream(filename);
const encoding = 'utf8';

function generateUsersData() {
  let i = 1000000;

  function write() {
    let ok = true;
    do {
      let first_name = faker.name.firstName();
      let last_name = faker.name.lastName();
   
      i--;
      if (i === 0) {
        data = `${i},${first_name}, ${last_name}\n`
        writeStream.write(data, encoding);
      } else {
        data = `${i},${first_name}, ${last_name}\n`       
        ok = writeStream.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writeStream.once('drain', write);
    } 
  }
  write();
}

generateUsersData();

