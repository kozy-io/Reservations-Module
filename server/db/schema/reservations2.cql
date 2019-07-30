DROP KEYSPACE IF EXISTS reservations2;
CREATE KEYSPACE IF NOT EXISTS reservations2 with replication={'class':'SimpleStrategy','replication_factor': 1};

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
  zipcode int,
  country text,
  currency text,
  localtax decimal,
  has_child boolean,
  room_listings list< int >,
  reserved_date map < text:int >,
  custom_rate map < text:decimal >,
  PRIMARY KEY(id, reserved_date, custom_rate, has_child, room_listings)
);

CREATE TABLE IF NOT EXISTS users (
  id int,
  first_name text,
  last_name text,
  PRIMARY KEY(id)
);