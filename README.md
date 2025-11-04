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

---

 Hotel Reservation - Frontend

Frontend del sistema de gestión de reservas de hotel, construido con React, TypeScript y Vite.

## Tecnologías

- **React 18** con TypeScript
- **Vite** como build tool
- **React Router** para navegación
- **Axios** para peticiones HTTP
- **Vitest** para testing
- **Storybook** para Visual TDD
- **CSS puro** (sin frameworks CSS)

## Arquitectura

El proyecto sigue los principios de **Clean Architecture**:
```
src/
├── domain/              # Lógica de negocio
│   ├── entities/        # Modelos de dominio
│   ├── repositories/    # Interfaces de repositorios
│   └── usecases/        # Casos de uso
├── infrastructure/      # Implementaciones
│   ├── api/            # Cliente HTTP
│   ├── repositories/   # Implementaciones de repositorios
│   └── storage/        # Almacenamiento local
└── presentation/        # Capa de UI
    ├── components/     # Componentes reutilizables
    ├── pages/         # Páginas de la aplicación
    ├── context/       # Context API de React
    └── hooks/         # Custom hooks
```

## Instalación
```bash
# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp .env.example .env
```

## Scripts Disponibles
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview

# Tests
npm run test
npm run test:ui

# Storybook
npm run storybook
npm run build-storybook

# Linting
npm run lint
```

## Variables de Entorno

Crea un archivo `.env` con:
```env
VITE_API_URL=http://localhost:3000
```

## Funcionalidades

### Para Huéspedes (GUEST)
- Registro e inicio de sesión
- Búsqueda de habitaciones disponibles
- Crear reservas
- Ver mis reservas
- Cancelar reservas

### Para Recepcionistas (RECEPTIONIST)
- Todo lo de huéspedes +
- Crear y gestionar habitaciones
- Ver todas las reservas
- Realizar check-in/check-out

### Para Administradores (ADMIN)
- Todas las funcionalidades

## Estructura de Componentes

Todos los componentes están documentados en Storybook. Para verlos:
```bash
npm run storybook
```

## Testing

El proyecto utiliza Vitest para testing:
```bash
# Ejecutar tests
npm run test

# Tests con UI
npm run test:ui
```

## Convenciones de Código

- **TypeScript** estricto habilitado
- **Arquitectura limpia** con separación de capas
- **Componentes funcionales** con hooks
- **CSS modular** por componente
- **Nombres descriptivos** para variables y funciones

## Integración con Backend

El frontend se comunica con el backend a través de la API REST en `http://localhost:3000`. Asegúrate de que el backend esté corriendo antes de iniciar el frontend.

## Deploy

Para hacer deploy:
```bash
npm run build
```

Los archivos de producción estarán en el directorio `dist/`.

---

El frontend estará disponible en `http://localhost:5173`

### Ejecutar Storybook
```bash
cd frontend
npm run storybook
```

Storybook estará disponible en `http://localhost:6006`

### Ejecutar Backend y Frontend simultáneamente

En una terminal:
```bash
# Backend
npm run dev
```

ó

```bash
cd backend
yarn dev
```

En otra terminal:
```bash
# Frontend
cd frontend
npm run dev
```

ó

```bash
cd frontend
yarn dev
```

