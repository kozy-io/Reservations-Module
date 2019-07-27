
const faker = require('faker');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

const filename = path.join(__dirname, '../csv/listing.csv');
const writeStream = fs.createWriteStream(filename);
const encoding = 'utf8';

// function generateListingData(writeStream, data, encoding) {

  let i = 100;
  write();

  function write() {
    let ok = true;
    do {
      let max_guests = faker.random.number({min: 2,max: 20});
      let cleaning_fee = faker.finance.amount(10,100,0);
      let zipcode = parseInt(faker.address.zipCode());
      let min_stay = faker.random.number({min: 1, max: 10});
      let base_rate = faker.finance.amount(50,1000,0);
      let extra_guest_cap = faker.random.number({min: 2, max: 4});
      let extra_guest_charge = faker.finance.amount(10,100,0);
      let star_rating = Math.round(faker.finance.amount(1.01,5.00,2));
      let review_count = faker.random.number({min: 24,max: 1000});
      let room_listings = [];
      
      //Update before seeding 10 mil
      if(i < 10) {
        let roomCount = faker.random.number({min: 5,max: 15});
        for(var j = 0; j < roomCount; j++) {
          room_listings.push(i*10 + j);
        }
      }

      let roomStr = JSON.stringify(room_listings)
      let newStr = `{${roomStr.slice(1,roomStr.length-1)}}`
      console.log('room_listings', newStr)
        
      i--;
      if (i === 0) {
        data = `${i},${max_guests}, ${cleaning_fee}, ${zipcode}, ${min_stay}, ${base_rate}, ${extra_guest_cap}, ${extra_guest_charge}, ${star_rating}, ${review_count}, ${newStr}\n`
        writeStream.write(data, encoding);
      } else {
        data = `${i},${max_guests}, ${cleaning_fee}, ${zipcode}, ${min_stay}, ${base_rate}, ${extra_guest_cap}, ${extra_guest_charge}, ${star_rating}, ${review_count}, ${newStr}\n`        
        ok = writeStream.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      writer.once('drain', write);
    } 
  }

  write();
// }



