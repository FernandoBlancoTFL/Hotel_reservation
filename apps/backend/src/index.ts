import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createAuthRoutes } from './presentation/routes/authRoutes';
import { createRoomRoutes } from './presentation/routes/roomRoutes';
import { createReservationRoutes } from './presentation/routes/reservationRoutes';
import { InMemoryUserRepository } from './infrastructure/repositories/InMemoryUserRepository';
import { InMemoryRoomRepository } from './infrastructure/repositories/InMemoryRoomRepository';
import { InMemoryReservationRepository } from './infrastructure/repositories/InMemoryReservationRepository';
import { errorHandler } from './presentation/middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize repositories
const userRepository = new InMemoryUserRepository();
const roomRepository = new InMemoryRoomRepository();
const reservationRepository = new InMemoryReservationRepository();

// Routes
app.use('/api/auth', createAuthRoutes(userRepository));
app.use('/api/rooms', createRoomRoutes(roomRepository, reservationRepository));
app.use('/api/reservations', createReservationRoutes(roomRepository, reservationRepository, userRepository));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`🏨 Rooms: http://localhost:${PORT}/api/rooms`);
  console.log(`📅 Reservations: http://localhost:${PORT}/api/reservations`);
});