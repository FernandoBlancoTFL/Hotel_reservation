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

## Ejecutar Pruebas

### Pruebas en modo watch (desarrollo)
```bash
yarn test
```

### Ejecutar todas las pruebas una vez
```bash
yarn test:run
```

### Ejecutar pruebas con cobertura
```bash
yarn test:coverage
```

### Ejecutar Vitest UI
```bash
yarn test:ui
```

## Estructura de Pruebas

- `src/domain/usecases/__tests__/` - Pruebas unitarias de casos de uso
- `src/infrastructure/repositories/__tests__/` - Pruebas de repositorios
- `src/presentation/components/__tests__/` - Pruebas de componentes React
- `src/presentation/pages/__tests__/` - Pruebas de páginas
- `src/presentation/context/__tests__/` - Pruebas de contextos
- `src/infrastructure/api/__tests__/` - Pruebas del cliente API

## Cobertura de Pruebas

Las pruebas cubren:
- ✅ Use Cases (LoginUseCase, RegisterUseCase, SearchRoomsUseCase, CreateReservationUseCase)
- ✅ Repositories (AuthRepositoryImpl, RoomRepositoryImpl, ReservationRepositoryImpl)
- ✅ Componentes (Button, Input, Card, RoomCard, Loading, Modal)
- ✅ Páginas (Login, Register, SearchRooms)
- ✅ Contextos (AuthContext)
- ✅ API Client

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

## 🐳 Ejecución con Docker

### Requisitos Previos para Docker
- [Docker](https://www.docker.com/get-started) (v20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 o superior)

### Instalación y Configuración

#### 1. Clonar el repositorio
```bash
git clone https://github.com/FernandoBlancoTFL/Hotel_reservation.git
cd Hotel_reservation
```

#### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```env
# Database
POSTGRES_USER=hotel_user
POSTGRES_PASSWORD=hotel_password
POSTGRES_DB=hotel_reservation
DATABASE_URL=postgresql://hotel_user:hotel_password@postgres:5432/hotel_reservation

# Backend
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production

# Frontend
VITE_API_URL=http://localhost:3000
```

#### 3. Levantar todos los servicios
```bash
# Levantar en segundo plano (modo detached)
docker compose up -d

# O levantar viendo los logs en tiempo real
docker compose up
```

Esto levantará tres servicios:
- **PostgreSQL** en el puerto 5432
- **Backend API** en http://localhost:3000
- **Frontend** en http://localhost:5173

#### 4. Verificar que los servicios están corriendo
```bash
docker compose ps
```

Deberías ver algo como:
```
NAME                IMAGE                           STATUS
hotel_backend       hotel_reservation-backend       Up
hotel_frontend      hotel_reservation-frontend      Up
hotel_postgres      postgres:15-alpine              Up
```

#### 5. Ver logs de los servicios
```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs solo del backend
docker compose logs -f backend

# Ver logs solo del frontend
docker compose logs -f frontend

# Ver logs solo de la base de datos
docker compose logs -f postgres
```

#### 6. Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **PostgreSQL:** localhost:5432

### Comandos Útiles de Docker
```bash
# Detener todos los servicios (mantiene datos)
docker compose down

# Detener y eliminar volúmenes (borra la base de datos)
docker compose down -v

# Reconstruir servicios después de cambios en el código
docker compose up --build

# Reconstruir sin cache
docker compose up --build --no-cache

# Reiniciar un servicio específico
docker compose restart backend

# Ver estado de los servicios
docker compose ps

# Detener sin eliminar contenedores
docker compose stop

# Iniciar contenedores detenidos
docker compose start

# Ejecutar comando dentro del contenedor del backend
docker compose exec backend sh

# Ejecutar comando dentro del contenedor de postgres
docker compose exec postgres psql -U hotel_user -d hotel_reservation
```

### Troubleshooting Docker

Si tienes problemas:

**1. Puerto ya en uso:**
```bash
# Verificar qué proceso usa el puerto 3000
lsof -i :3000

# O cambiar el puerto en docker-compose.yml
```

**2. Reconstruir todo desde cero:**
```bash
docker compose down -v --rmi all
docker compose up --build
```

**3. Ver logs detallados:**
```bash
docker compose logs --tail=100 backend
```

**4. Limpiar recursos de Docker:**
```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Eliminar volúmenes no utilizados
docker volume prune
```

### Notas Importantes sobre Docker

- El proyecto utiliza **npm workspaces** para gestionar el monorepo
- Los **TypeScript paths** (`@hotel/domain`) se resuelven automáticamente mediante el script `fix-imports.js` durante el build
- La base de datos PostgreSQL persiste los datos en un volumen Docker, por lo que los datos se mantienen entre reinicios
- Para **borrar completamente la base de datos** usa: `docker compose down -v`
