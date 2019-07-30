DROP KEYSPACE IF EXISTS reservations;
CREATE KEYSPACE IF NOT EXISTS reservations with replication={'class':'SimpleStrategy','replication_factor': 1};

USE reservations;

CREATE TABLE listing (
  id int,
  max_guests smallint,
  cleaning_fee smallint,
  zipcode_id int,
  min_stay smallint,
  base_rate smallint, 
  extra_guest_cap smallint,
  extra_guest_charge smallint,
  star_rating smallint,
  review_count smallint,
  room_listings list< int >,
  PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS reserved_date (
  id int,
  listing_id int,
  booked_date text,
  booked_week_day text,
  booked_year text,
  booked_month text,
  booked_day text,
  users_id int,   
  PRIMARY KEY(listing_id, booked_year, booked_month, booked_day)
);

CREATE TABLE IF NOT EXISTS custom_rate (
  id int,
  listing_id int,
  custom_date text,
  booked_week_day text,
  custom_year text,
  custom_month text,
  custom_day text,
  custom_markup decimal,
  PRIMARY KEY(listing_id, custom_year, custom_month, custom_day)
);

CREATE TABLE IF NOT EXISTS locations (
  id int,
  zipcode int,
  country text,
  currency text,
  localtax decimal,
  PRIMARY KEY(id)  
);

CREATE TABLE IF NOT EXISTS users (
  id int,
  first_name text,
  last_name text,
  PRIMARY KEY(id)
);