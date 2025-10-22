import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { IRoomRepository } from '@hotel/domain/src/repositories/IRoomRepository';
import { IReservationRepository } from '@hotel/domain/src/repositories/IReservationRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

export const createRoomRoutes = (
  roomRepository: IRoomRepository,
  reservationRepository: IReservationRepository
): Router => {
  const router = Router();
  const roomController = new RoomController(roomRepository, reservationRepository);

  // Public routes
  router.get('/search', roomController.searchAvailable);
  router.get('/', roomController.getAll);
  router.get('/:id', roomController.getById);

  // Protected routes
  router.post('/', authMiddleware, roomController.create);

  return router;
};