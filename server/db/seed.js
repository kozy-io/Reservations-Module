const faker = require('faker');
const db = require('./index.js');

let generateListing = () => {
  let max_guests = faker.random.number({
    min: 2,
    max: 20
  });

  let cleaning_fee = faker.finance.amount(10,100,0);
  let min_stay = faker.random.number({
    min: 1,
    max: 10
  });

  let base_rate = faker.finance.amount(50,1000,0);
  let extra_guest_cap = faker.random.number({
    min: 2,
    max: 4
  });

  let extra_guest_charge = faker.finance.amount(10,100,0);

  let star_rating = faker.finance.amount(1.01,5.00,2);

  let review_count = faker.random.number({
    min: 24,
    max: 1000
  });

  db.Listing.create({
    max_guests, cleaning_fee, min_stay, base_rate, extra_guest_cap, extra_guest_charge, star_rating, review_count
  })
  return;
}

let generateReserved = () => {

  let listing_id = 1;

  while (listing_id < 101) {
    // for each listing, create multiple records
    for (var i = 0; i < 4; i++) {
      let dateRecent = faker.date.between('2019-07-04', '2019-07-30');
      let dateCurrYear = faker.date.between('2019-08-01', '2019-12-31');
      let dateFuture = faker.date.between('2020-01-01', '2020-03-30');
  
      db.Reserved.create({
        listing_id: listing_id,
        date: dateRecent
      });
    
      db.Reserved.create({
        listing_id: listing_id,
        date: dateCurrYear
      });
    
      db.Reserved.create({
        listing_id: listing_id,
        date: dateFuture
      });
    }

    listing_id++; 
  }
}

generateCustom = () => {
  let listing_id = 1;

  while (listing_id < 101) {
    let date1 = faker.date.between('2019-07-04', '2019-07-14');
    let date2 = faker.date.between('2019-07-15', '2019-07-30');
    let date3 = faker.date.between('2019-08-01', '2019-08-14');
    let date4 = faker.date.between('2019-08-15', '2019-08-30');
    let price = faker.finance.amount(100,400,0);

    db.CustomRates.create({
      listing_id,
      date: date1,
      price: price
    })

    db.CustomRates.create({
      listing_id,
      date: date2,
      price: price
    })

    db.CustomRates.create({
      listing_id,
      date: date3,
      price: price
    })

    db.CustomRates.create({
      listing_id,
      date: date4,
      price: price
    })

    listing_id = listing_id + 3;

  }
}

for (var i = 0; i < 100; i++) {
  generateListing();
}

generateReserved();

generateCustom();

