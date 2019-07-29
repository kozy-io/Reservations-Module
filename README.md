# Reservations
> Component to select calendar dates and number of guests for booking. It also displays prices per night and total number of reviews.
## Related Projects
- https://github.com/kozy-io/listing
- https://github.com/kozy-io/photo-carousel-service

## API

### Listing
| HTTP Method   | Endpoint                      | Description                                       |
|:--------------|:------------------------------|:--------------------------------------------------|
| GET           | /api/reservations/:listingID  | Return listing details for reservations module    |
| POST          | /api/reservations             | Create a new listing                              |
| PUT           | /api/reservations/:listingID  | Replace details for a listing record              |
| PATCH         | /api/reservations/:listingID  | Update details for a listing record               |
| DELETE        | /api/reservations/:listingID  | Delete a listing record                           |

### Reservation - Reserved
| HTTP Method     | Endpoint                               | Description                              |
|:----------------|:---------------------------------------|:-----------------------------------------|
| GET             | /api/reservations/:listingID/reserved  | Return all reserved dates for a listing  |
| POST            | /api/reservations/reserved             | Add a reserved date for a listing         |
| PUT             | /api/reservations/:listingID/reserved  | Replace a reserved date for a  listing   |
| PATCH           | /api/reservations/:listingID/reserved  | Update a reserved date for a listing    |   
| DELETE          | /api/reservations/:listingID/reserved  | Delete a reserved date for a listing     |

### Reservation - Custom
| HTTP Method     | Endpoint                             | Description                                        |
|:----------------|:-------------------------------------|:---------------------------------------------------|
| GET             | /api/reservations/:listingID/custom  | Return all custom pricing and dates for a listing  |
| POST            | /api/reservations/custom             | Add a custom pricing and dates for a listing       |
| PUT             | /api/reservations/:listingID/custom  | Replace custom pricing and dates for a listing     |
| PATCH           | /api/reservations/:listingID/custom  | Update custom details for a listing                |   
| DELETE          | /api/reservations/:listingID/custom  | Delete custom details for a listing                |


## Development

From within the root directory:

```sh
npm install
npm run start
npm run db
npm run seed
npm run react-dev
```
