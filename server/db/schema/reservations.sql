DROP DATABASE IF EXISTS reservations;
CREATE DATABASE reservations;
SET timezone = 'America/Los_Angeles';
SHOW TIMEZONE;

\c reservations;

CREATE TABLE listing (
  id serial PRIMARY KEY,
  max_guests SMALLINT,
  cleaning_fee SMALLINT,
  zipcode_id INT,
  min_stay SMALLINT,
  base_rate SMALLINT,
  extra_guest_cap SMALLINT,
  extra_guest_charge SMALLINT,
  st\dar_rating SMALLINT,
  review_count SMALLINT,
  room_listings INT []
);

CREATE TABLE reserved_date (
  id serial PRIMARY KEY,
  listing_id INT,
  booked_date TEXT,
  booked_week_day TEXT,
  booked_year TEXT,
  booked_month TEXT,
  booked_day TEXT,
  users_id INT
);

CREATE TABLE custom_rate (
  id serial PRIMARY KEY,
  listing_id INT,
  custom_date TEXT,
  booked_week_day TEXT,
  custom_year TEXT,
  custom_month TEXT,
  custom_day TEXT,
  custom_markup DECIMAL
);

CREATE TABLE locations (
  id serial PRIMARY KEY,
  zipcode INT,
  country TEXT,
  currency TEXT,
  localtax DECIMAL
);

CREATE TABLE users (
  id serial PRIMARY KEY,
  first_name TEXT,
  last_name TEXT
);