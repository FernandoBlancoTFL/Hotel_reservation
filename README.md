# Hotel Reservation System - Backend API

API REST para el sistema de gestión de reservas de hotel.

## Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "phone": "+1234567890",
  "documentId": "12345678",
  "role": "GUEST" // GUEST | RECEPTIONIST | ADMIN
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "GUEST"
  },
  "token": "jwt-token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "GUEST"
  },
  "token": "jwt-token"
}
```

---

### Rooms

#### Create Room (Admin/Receptionist only)
```http
POST /api/rooms
Authorization: Bearer {token}
Content-Type: application/json

{
  "number": "101",
  "type": "SINGLE", // SINGLE | DOUBLE | SUITE | DELUXE
  "pricePerNight": 100,
  "currency": "USD",
  "capacity": 1,
  "amenities": ["WiFi", "TV", "MiniBar"]
}
```

#### Get All Rooms
```http
GET /api/rooms
```

#### Get Room by ID
```http
GET /api/rooms/{id}
```

#### Search Available Rooms
```http
GET /api/rooms/search?checkInDate=2024-06-01&checkOutDate=2024-06-05&capacity=2&roomType=DOUBLE
```

Query Parameters:
- `checkInDate` (required): ISO date string
- `checkOutDate` (required): ISO date string
- `capacity` (optional): number of guests
- `roomType` (optional): SINGLE | DOUBLE | SUITE | DELUXE

---

### Reservations

All reservation endpoints require authentication.

#### Create Reservation
```http
POST /api/reservations
Authorization: Bearer {token}
Content-Type: application/json

{
  "roomId": "room-uuid",
  "checkInDate": "2024-06-01",
  "checkOutDate": "2024-06-05",
  "numberOfGuests": 2
}
```

#### Get My Reservations
```http
GET /api/reservations/my-reservations
Authorization: Bearer {token}
```

#### Get All Reservations (Admin/Receptionist only)
```http
GET /api/reservations
Authorization: Bearer {token}
```

#### Cancel Reservation
```http
POST /api/reservations/{id}/cancel
Authorization: Bearer {token}
```

#### Check In (Receptionist/Admin only)
```http
POST /api/reservations/{id}/check-in
Authorization: Bearer {token}
```

#### Check Out (Receptionist/Admin only)
```http
POST /api/reservations/{id}/check-out
Authorization: Bearer {token}
```

---

## Testing with cURL

### 1. Register a Guest
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "guest@example.com",
    "password": "Pass123456",
    "name": "Guest User",
    "phone": "+1234567890",
    "documentId": "12345678",
    "role": "GUEST"
  }'
```

### 2. Register a Receptionist
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "receptionist@example.com",
    "password": "Pass123456",
    "name": "Receptionist User",
    "phone": "+0987654321",
    "documentId": "87654321",
    "role": "RECEPTIONIST"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "receptionist@example.com",
    "password": "Pass123456"
  }'
```

### 4. Create a Room (use token from login)
```bash
curl -X POST http://localhost:3000/api/rooms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "number": "101",
    "type": "SINGLE",
    "pricePerNight": 100,
    "currency": "USD",
    "capacity": 1,
    "amenities": ["WiFi", "TV"]
  }'
```

### 5. Search Available Rooms
```bash
curl "http://localhost:3000/api/rooms/search?checkInDate=2024-06-01&checkOutDate=2024-06-05&capacity=1"
```

### 6. Create a Reservation (as guest, use guest token)
```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer GUEST_TOKEN_HERE" \
  -d '{
    "roomId": "ROOM_ID_HERE",
    "checkInDate": "2024-06-01",
    "checkOutDate": "2024-06-05",
    "numberOfGuests": 1
  }'
```

### 7. Get My Reservations
```bash
curl http://localhost:3000/api/reservations/my-reservations \
  -H "Authorization: Bearer GUEST_TOKEN_HERE"
```

### 8. Check In (as receptionist)
```bash
curl -X POST http://localhost:3000/api/reservations/RESERVATION_ID_HERE/check-in \
  -H "Authorization: Bearer RECEPTIONIST_TOKEN_HERE"
```

---

## Roles and Permissions

### GUEST
- Create reservations
- Cancel own reservations
- View own reservations

### RECEPTIONIST
- All GUEST permissions
- Create/update rooms
- Check in/check out reservations
- Cancel any reservation
- View all reservations

### ADMIN
- All RECEPTIONIST permissions
- Delete rooms
- Manage users
- Full system access

---

## Environment Variables

Create a `.env` file in the backend directory:
```
PORT=3000
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

---

## Running the Server
```bash
# Development mode with auto-reload
yarn dev

# Build
yarn build

# Production
yarn start
```

## Using Swagger

url: http://localhost:3000/api-docs