Create keyspace IF NOT EXISTS Listing with replication={'class':'SimpleStrategy','replication_factor': 1};

Create table IF NOT EXISTS Listings.booking (
  id uuid,
  max_guests smallint,
  cleaning_fee smallint,
  zipcode int,
  min_stay smallint,
  base_rate smallint, 
  extra_guest_cap smallint,
  extra_guest_charge smallint,
  star_rating smallint,
  review_count smallint,
  room_listings smallint
  PRIMARY KEY(reserved_year, reserved_year, reserved_day, status, user_id)
);

