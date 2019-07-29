const Sequelize = require('sequelize');

//Create schema for PostgreSQL
const sequelize = new Sequelize('reservations', 'shane', '', {
  host: 'localhost',
  dialect: 'postgres',
});

const Listing = sequelize.define('listing', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  max_guests: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  cleaning_fee: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  zipcode: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  min_stay: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  base_rate: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  extra_guest_cap: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  extra_guest_charge: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  star_rating: {
    type: Sequelize.INTEGER,
  },
  review_count: {
    type: Sequelize.INTEGER
  },
  room_listings: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    defaultValue: []    
  }
});

const Reserved = sequelize.define('reserved_date', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  listing_id: {
    type: Sequelize.INTEGER,
  },
  date: {
    type: Sequelize.DATEONLY,
  }
})

const CustomRates = sequelize.define('custom_rate', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  listing_id: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.DATEONLY,
  },
  price: {
    type: Sequelize.INTEGER
  }
});

const Location = sequelize.define ('location', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    unique: true
  },
  zipcode: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  country: {
    type: Sequelize.STRING,
    defaultValue: 'United States'
  },
  currency: {
    type: Sequelize.STRING,
    defaultValue: 'USD'
  },
  localtax: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

sequelize.sync();

module.exports = {
  Listing, Reserved, CustomRates, Location, sequelize,
}