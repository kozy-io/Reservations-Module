# Reservations
> Component to select calendar dates and number of guests for booking. It also displays prices per night and total number of reviews.

## Getting Started
### Requirements
- Node 6.13.0
- MySQL v5.5

### Installing Dependencies
From within the root directory:

```sh
npm install
```
### Usage
> Run webpack
```sh
npm run react-dev
```
> Seed MySQL database with mock data
```sh
npm run seed
```
> Run server on port 3006
```sh
npm run start-nodemon
```

## API
### Listing
| HTTP Method   | Endpoint                      | Description                                       |
|:--------------|:------------------------------|:--------------------------------------------------|
| GET           | /listing/:listingID           | Return listing details for reservations module    |

### Reservation - Reserved
| HTTP Method     | Endpoint                               | Description                              |
|:----------------|:---------------------------------------|:-----------------------------------------|
| GET             | /reserved/month/                       | Return all reserved dates for a listing  |

### Reservation - Custom
| HTTP Method     | Endpoint                             | Description                                        |
|:----------------|:-------------------------------------|:---------------------------------------------------|
| GET             | /custom/month/                       | Return all custom pricing and dates for a listing  |

### Built With:
* [React] - Frontend Framework
* [Express] - Server
* [MySQL]- Database

### Related Projects
  - https://github.com/kozy-io
