const Sequelize = require('sequelize');

const sequelize = new Sequelize('guestly_reservations', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const Listing = sequelize.define('listing', {
  id: {
    type: Sequelize.INTEGER,
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
  local_tax: {
    type: Sequelize.DECIMAL(10,2),
    defaultValue: 0.085,
  },
  min_stay: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  base_rate: {
    type: Sequelize.DECIMAL(10,2),
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
  currency: {
    type: Sequelize.STRING,
    defaultValue: 'USD'
  },
  star_rating: {
    type: Sequelize.DECIMAL(10,1),
  },
  review_count: {
    type: Sequelize.INTEGER
  }
});

const Reserved = sequelize.define('reserved_date', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  listing_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Listing,
      key: 'id',
    }
  },
  date: {
    type: Sequelize.DATEONLY,
  }
},
{
  indexes: [
      {
          unique: true,
          fields: ['listing_id', 'date']
      }
  ]
})

const CustomRates = sequelize.define('custom_rate', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true
  },
  listing_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Listing,
      key: 'id'
    }
  },
  date: {
    type: Sequelize.DATEONLY,
  },
  price: {
    type: Sequelize.DECIMAL(10,2)
  }
},
{
  indexes: [
      {
          unique: true,
          fields: ['listing_id', 'date']
      }
  ]
})

sequelize.sync();

module.exports = {
  Listing, Reserved, CustomRates, sequelize,
}