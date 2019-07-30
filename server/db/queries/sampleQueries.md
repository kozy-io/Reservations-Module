##POSTGRES Sample Queries
```sql
SELECT * FROM reserved_date WHERE listing_id = 999999;
```
 id  | listing_id |               booked_date               | booked_week_day | booked_year | booked_month | booked_day | users_id 
-----+------------+-----------------------------------------+-----------------+-------------+--------------+------------+----------
   2 |     999999 | Fri Oct 18 2019 11:03:34 GMT-0700 (PDT) | Fri             | 2019        | Oct          | 18         |   999999
 454 |     999999 | Tue Dec 10 2019 05:27:45 GMT-0800 (PST) | Tue             | 2019        | Dec          | 10         |   999999
 455 |     999999 | Sat Sep 28 2019 08:42:25 GMT-0700 (PDT) | Sat             | 2019        | Sep          | 28         |   999999
 456 |     999999 | Fri Nov 08 2019 14:18:27 GMT-0800 (PST) | Fri             | 2019        | Nov          | 08         |   999999
 457 |     999999 | Thu Sep 12 2019 01:36:15 GMT-0700 (PDT) | Thu             | 2019        | Sep          | 12         |   999999
 458 |     999999 | Thu Nov 07 2019 10:19:51 GMT-0800 (PST) | Thu             | 2019        | Nov          | 07         |   999999
 459 |     999999 | Sun Aug 25 2019 13:32:12 GMT-0700 (PDT) | Sun             | 2019        | Aug          | 25         |   999999
 460 |     999999 | Thu Nov 07 2019 13:51:51 GMT-0800 (PST) | Thu             | 2019        | Nov          | 07         |   999999
 461 |     999999 | Thu Jan 16 2020 07:55:57 GMT-0800 (PST) | Thu             | 2020        | Jan          | 16         |   999999
(9 rows)

```sql
SELECT * FROM listing WHERE id = 9999999;
```
   id    | max_guests | cleaning_fee | zipcode_id | min_stay | base_rate | extra_guest_cap | extra_guest_charge | star_rating | review_count | room_listings 
---------+------------+--------------+------------+----------+-----------+-----------------+--------------------+-------------+--------------+---------------
 9999999 |         12 |           90 |       1837 |        7 |        54 |               3 |                 66 |           1 |          574 | {}
(1 row)


##CASSANDRA Sample Queries
```sql
SELECT * FROM reserved_date WHERE listing_id = 999999;
```
listing_id | booked_year | booked_month | booked_day | booked_date                             | booked_week_day | id  | users_id
------------+-------------+--------------+------------+-----------------------------------------+-----------------+-----+----------
     999999 |        2019 |          Dec |         16 | Mon Dec 16 2019 05:13:28 GMT-0800 (PST) |             Mon | 458 |   999999
     999999 |        2019 |          Dec |         29 | Sun Dec 29 2019 04:58:14 GMT-0800 (PST) |             Sun | 463 |   999999
     999999 |        2019 |          Nov |         10 | Sun Nov 10 2019 17:28:38 GMT-0800 (PST) |             Sun | 462 |   999999
     999999 |        2019 |          Nov |         15 | Fri Nov 15 2019 18:27:27 GMT-0800 (PST) |             Fri | 460 |   999999
     999999 |        2019 |          Nov |         16 | Sat Nov 16 2019 22:59:13 GMT-0800 (PST) |             Sat | 456 |   999999
     999999 |        2019 |          Oct |         04 | Fri Oct 04 2019 22:42:57 GMT-0700 (PDT) |             Fri | 457 |   999999
     999999 |        2019 |          Oct |         28 | Mon Oct 28 2019 14:08:02 GMT-0700 (PDT) |             Mon | 459 |   999999
     999999 |        2019 |          Sep |         21 | Sat Sep 21 2019 16:23:04 GMT-0700 (PDT) |             Sat |   2 |   999999
     999999 |        2020 |          Jul |         27 | Mon Jul 27 2020 23:55:28 GMT-0700 (PDT) |             Mon | 455 |   999999
     999999 |        2020 |          Mar |         29 | Sun Mar 29 2020 10:03:37 GMT-0700 (PDT) |             Sun | 461 |   999999

(10 rows)

```sql
SELECT * FROM listing WHERE id = 9999999;
```
 id      | base_rate | cleaning_fee | extra_guest_cap | extra_guest_charge | max_guests | min_stay | review_count | room_listings | star_rating | zipcode_id
---------+-----------+--------------+-----------------+--------------------+------------+----------+--------------+---------------+-------------+------------
 9999999 |       448 |           32 |               2 |                 19 |         14 |        2 |          201 |          null |           1 |       5342