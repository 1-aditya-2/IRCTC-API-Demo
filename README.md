# IRCTC-API-Demo

## Overview

IRCTC Railway Management System is a real-time railway seat booking system where users can check train availability and book seats between two stations. The system ensures data consistency using a locking mechanism to handle race conditions during simultaneous bookings.

## Features

### User Management
- User registration and login with JWT authentication.
- Role-based access control (User/Admin).

### Train Availability
- Fetch available trains between two stations.
- Display available seat count per train.

### Seat Booking
- Users can book seats on available trains.
- Prevents double-booking using transaction-based locking.

### Admin Functionalities
- Add new trains to the database.
- Update seat availability for existing trains.

### Database Management
- MySQL database to store user details, train information, and bookings.

## Project Setup

### Prerequisites

Ensure you have the following installed:
- Node.js (v14 or later)
- MySQL Server
- npm (Node Package Manager)


### Installation & Setup

#### Clone the repository:

#### Install dependencies:

#### Set up the database:


## API Endpoints

### User Routes

#### 1. Register a new user

**Method:** POST

**Endpoint:** `/user/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### 2. Login

**Method:** POST

**Endpoint:** `/user/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### 3. Check train availability

**Method:** GET

**Endpoint:** `/user/availability?source=Ranchi&destination=Delhi`


#### 4. Book Seats

**Method:** POST

**Endpoint:** `/user/bookTickets`

**Request Body:**
```json
{
  "trainId": 1,
  "seatsToBook": 2
}
```

#### 5. Booking Details

**Method:** GET

**Endpoint:** `/user/getBookingDetails`

**Response:**
```json
[
  {
    "booking_id": 1,
    "number_of_seats": 2,
    "train_number": "12345",
    "source": "Ranchi",
    "destination": "Delhi"
  }
]
```

### Admin Routes

#### 1. Add a new train

**Method:** POST

**Endpoint:** `/admin/addTrain`

**Request Body:**
```json
{
  "trainNumber": "12345",
  "source": "Ranchi",
  "destination": "Delhi",
  "totalSeats": 100,
  "availableSeats": 100
}
```

#### 2. Update seat availability

**Method:** PUT

**Endpoint:** `/admin/update-seats/2`

**Request Body:**
```json
{
  "availableSeats": 80
}
```

## Race Condition Handling

The booking system uses a MySQL row-level lock to prevent multiple users from booking the same seat simultaneously.

Transactions are used to ensure consistency, rolling back in case of failures.

If two users try to book the last seat at the same time, only the first one to get the lock will be able to complete the booking.
```` ▋
