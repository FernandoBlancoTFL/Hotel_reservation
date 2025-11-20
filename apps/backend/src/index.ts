import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createDatabasePool, initializeDatabase } from './infrastructure/database/database';
import { PostgresUserRepository } from './infrastructure/repositories/PostgresUserRepository';
import { PostgresRoomRepository } from './infrastructure/repositories/PostgresRoomRepository';
import { PostgresReservationRepository } from './infrastructure/repositories/PostgresReservationRepository';
import { AuthController } from './presentation/controllers/AuthController';
import { RoomController } from './presentation/controllers/RoomController';
import { ReservationController } from './presentation/controllers/ReservationController';
import { authMiddleware } from './presentation/middlewares/authMiddleware';
import { roleMiddleware } from './presentation/middlewares/roleMiddleware';
import { UserRole } from '@hotel/domain/src/entities/User';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database and start server
const startServer = async () => {
  try {
    // Create database pool
    const pool = createDatabasePool();
    
    // Initialize database tables
    await initializeDatabase(pool);
    console.log('Database connected and initialized');

    // Create repositories with PostgreSQL
    const userRepository = new PostgresUserRepository(pool);
    const roomRepository = new PostgresRoomRepository(pool);
    const reservationRepository = new PostgresReservationRepository(pool);

    // Create controllers
    const authController = new AuthController(userRepository);
    const roomController = new RoomController(roomRepository, reservationRepository);
    const reservationController = new ReservationController(
      roomRepository,
      reservationRepository,
      userRepository
    );

    // Health check
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', message: 'Server is running' });
    });

    // Auth routes
    app.post('/api/auth/register', authController.register);
    app.post('/api/auth/login', authController.login);

    // Room routes
    app.post('/api/rooms', authMiddleware, roleMiddleware([UserRole.RECEPTIONIST, UserRole.ADMIN]), roomController.create);
    app.get('/api/rooms', roomController.getAll);
    app.get('/api/rooms/search', roomController.searchAvailable);
    app.get('/api/rooms/:id', roomController.getById);

    // Reservation routes
    app.post('/api/reservations', authMiddleware, reservationController.create);
    app.get('/api/reservations/my-reservations', authMiddleware, reservationController.getMyReservations);
    app.get('/api/reservations', authMiddleware, roleMiddleware([UserRole.RECEPTIONIST, UserRole.ADMIN]), reservationController.getAll);
    app.post('/api/reservations/:id/cancel', authMiddleware, reservationController.cancel);
    app.post('/api/reservations/:id/check-in', authMiddleware, roleMiddleware([UserRole.RECEPTIONIST, UserRole.ADMIN]), reservationController.checkIn);
    app.post('/api/reservations/:id/check-out', authMiddleware, roleMiddleware([UserRole.RECEPTIONIST, UserRole.ADMIN]), reservationController.checkOut);

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();