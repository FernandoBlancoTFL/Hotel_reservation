import { Router } from 'express';
import { ReservationController } from '../controllers/ReservationController';
import { IRoomRepository } from '@hotel/domain/src/repositories/IRoomRepository';
import { IReservationRepository } from '@hotel/domain/src/repositories/IReservationRepository';
import { IUserRepository } from '@hotel/domain/src/repositories/IUserRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

export const createReservationRoutes = (
  roomRepository: IRoomRepository,
  reservationRepository: IReservationRepository,
  userRepository: IUserRepository
): Router => {
  const router = Router();
  const reservationController = new ReservationController(
    roomRepository,
    reservationRepository,
    userRepository
  );

  // All reservation routes require authentication
  router.use(authMiddleware);

  router.post('/', reservationController.create);
  router.get('/my-reservations', reservationController.getMyReservations);
  router.get('/', reservationController.getAll);
  router.post('/:id/cancel', reservationController.cancel);
  router.post('/:id/check-in', reservationController.checkIn);
  router.post('/:id/check-out', reservationController.checkOut);

  return router;
};