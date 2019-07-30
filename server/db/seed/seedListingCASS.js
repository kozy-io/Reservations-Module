
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const filename = path.join(__dirname, '../../csv/cassandra/listing.csv');
const writeStream = fs.createWriteStream(filename);
const encoding = 'utf8';

function generateListingData() {
  let i = 10000000;

  function write() {
    let ok = true;
    do {
      let max_guests = faker.random.number({min: 2,max: 20});
      let cleaning_fee = faker.finance.amount(10,100,0);
      let min_stay = faker.random.number({min: 1, max: 10});
      let base_rate = faker.random.number({min: 50, max: 500});
      let extra_guest_cap = faker.random.number({min: 2, max: 4});
      let extra_guest_charge = faker.finance.amount(10,100,0);
      let star_rating = faker.random.number({min: 1, max: 5});
      let review_count = faker.random.number({min: 24,max: 1000});
      let room_listings = [];
      let zipcode_id = faker.random.number({min: 0,max: 10000});;
      
      //Update before seeding 10 mil
      if(i < 200) {
        let roomCount = faker.random.number({min: 5,max: 15});
        for(var j = 0; j < roomCount; j++) {
          room_listings.push(i*10 + j);
        }
      }

      let newStr = `"[${room_listings}]"`;
   
      i--;
      if (i === 0) {
        data = `${i},${base_rate},${cleaning_fee},${extra_guest_cap},${extra_guest_charge},${max_guests},${min_stay},${review_count},${newStr},${star_rating},${zipcode_id}\n`
        writeStream.write(data, encoding);
      } else {
        data = `${i},${base_rate},${cleaning_fee},${extra_guest_cap},${extra_guest_charge},${max_guests},${min_stay},${review_count},${newStr},${star_rating},${zipcode_id}\n`     
        ok = writeStream.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writeStream.once('drain', write);
    } 
  }
  write();
}

generateListingData();

