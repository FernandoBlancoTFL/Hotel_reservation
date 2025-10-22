import { Response } from 'express';
import { CreateReservation } from '@hotel/domain/src/use-cases/reservations/CreateReservation';
import { CancelReservation } from '@hotel/domain/src/use-cases/reservations/CancelReservation';
import { CheckInReservation } from '@hotel/domain/src/use-cases/reservations/CheckInReservation';
import { CheckOutReservation } from '@hotel/domain/src/use-cases/reservations/CheckOutReservation';
import { IRoomRepository } from '@hotel/domain/src/repositories/IRoomRepository';
import { IReservationRepository } from '@hotel/domain/src/repositories/IReservationRepository';
import { IUserRepository } from '@hotel/domain/src/repositories/IUserRepository';
import { AuthRequest } from '../middlewares/authMiddleware';

export class ReservationController {
  constructor(
    private roomRepository: IRoomRepository,
    private reservationRepository: IReservationRepository,
    private userRepository: IUserRepository
  ) {}

  create = async (req: AuthRequest, res: Response) => {
    try {
      const { roomId, checkInDate, checkOutDate, numberOfGuests } = req.body;
      const userId = req.user!.userId;

      if (!roomId || !checkInDate || !checkOutDate || !numberOfGuests) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const createReservation = new CreateReservation(
        this.roomRepository,
        this.reservationRepository,
        this.userRepository
      );

      const reservation = await createReservation.execute({
        userId,
        roomId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        numberOfGuests
      });

      res.status(201).json({
        id: reservation.id,
        userId: reservation.userId,
        roomId: reservation.roomId,
        checkInDate: reservation.dateRange.startDate,
        checkOutDate: reservation.dateRange.endDate,
        numberOfGuests: reservation.numberOfGuests,
        totalPrice: {
          amount: reservation.totalPrice.amount,
          currency: reservation.totalPrice.currency
        },
        status: reservation.status
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getMyReservations = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const reservations = await this.reservationRepository.findByUserId(userId);

      res.status(200).json(
        reservations.map(reservation => ({
          id: reservation.id,
          roomId: reservation.roomId,
          checkInDate: reservation.dateRange.startDate,
          checkOutDate: reservation.dateRange.endDate,
          numberOfGuests: reservation.numberOfGuests,
          totalPrice: {
            amount: reservation.totalPrice.amount,
            currency: reservation.totalPrice.currency
          },
          status: reservation.status,
          createdAt: reservation.createdAt
        }))
      );
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getAll = async (req: AuthRequest, res: Response) => {
    try {
      const reservations = await this.reservationRepository.findAll();

      res.status(200).json(
        reservations.map(reservation => ({
          id: reservation.id,
          userId: reservation.userId,
          roomId: reservation.roomId,
          checkInDate: reservation.dateRange.startDate,
          checkOutDate: reservation.dateRange.endDate,
          numberOfGuests: reservation.numberOfGuests,
          totalPrice: {
            amount: reservation.totalPrice.amount,
            currency: reservation.totalPrice.currency
          },
          status: reservation.status,
          createdAt: reservation.createdAt
        }))
      );
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  cancel = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const cancelReservation = new CancelReservation(
        this.reservationRepository,
        this.userRepository
      );

      const reservation = await cancelReservation.execute({
        reservationId: id,
        userId
      });

      res.status(200).json({
        id: reservation.id,
        status: reservation.status
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  checkIn = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const checkInReservation = new CheckInReservation(
        this.reservationRepository,
        this.roomRepository,
        this.userRepository
      );

      const reservation = await checkInReservation.execute({
        reservationId: id,
        userId
      });

      res.status(200).json({
        id: reservation.id,
        status: reservation.status
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  checkOut = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const checkOutReservation = new CheckOutReservation(
        this.reservationRepository,
        this.roomRepository,
        this.userRepository
      );

      const reservation = await checkOutReservation.execute({
        reservationId: id,
        userId
      });

      res.status(200).json({
        id: reservation.id,
        status: reservation.status
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}