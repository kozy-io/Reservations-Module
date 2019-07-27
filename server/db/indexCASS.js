const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['h1', 'h2'], localDataCenter: 'datacenter1', keyspace: 'ks1' });
 
//Using list and map
// CREATE TABLE listing (
//   id int PRIMARY KEY,
//   max_guests text,
//   cleaning_fee int,
//   local_tax float,
//   min_stay int,
//   base_rate float,
//   extra_guest_cap int,
//   extra_guest_charge int,
//   currency text,
//   star_rating float,
//   review_count int, 
//   reserved_dates list<varchar>,
//   custom_prices map<varchar, float>
// );

//Using Primary Key
CREATE TABLE listing (
  max_guests text,
  cleaning_fee int,
  local_tax float,
  min_stay int,
  base_rate float,
  extra_guest_cap int,
  extra_guest_charge int,
  currency text,
  star_rating float,
  review_count int, 
  PRIMARY KEY 
    (dates varchar, reserved Boolean, price float)
);

//Multiple tables, insert foreign key via server logic
// CREATE TABLE listing (
//   id int PRIMARY KEY,
//   max_guests text,
//   cleaning_fee int,
//   local_tax float,
//   min_stay int,
//   base_rate float,
//   extra_guest_cap int,
//   extra_guest_charge int,
//   currency text,
//   star_rating float,
//   review_count int
// );

// CREATE TABLE reserved (
//   id int PRIMARY KEY,
//   listing_id int,
//   date varchar
// );

// CREATE TABLE custom (
//   id int PRIMARY KEY,
//   listing_id int,
//   date varchar,
//   date float
// );