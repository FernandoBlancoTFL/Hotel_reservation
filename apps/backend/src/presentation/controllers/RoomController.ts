import { Request, Response } from 'express';
import { CreateRoom } from '@hotel/domain/src/use-cases/rooms/CreateRoom';
import { SearchAvailableRooms } from '@hotel/domain/src/use-cases/rooms/SearchAvailableRooms';
import { IRoomRepository } from '@hotel/domain/src/repositories/IRoomRepository';
import { IReservationRepository } from '@hotel/domain/src/repositories/IReservationRepository';
import { RoomType } from '@hotel/domain/src/entities/Room';
import { AuthRequest } from '../middlewares/authMiddleware';

export class RoomController {
  constructor(
    private roomRepository: IRoomRepository,
    private reservationRepository: IReservationRepository
  ) {}

  create = async (req: AuthRequest, res: Response) => {
    try {
      const { number, type, pricePerNight, currency, capacity, amenities } = req.body;

      if (!number || !type || !pricePerNight || !currency || !capacity) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const createRoom = new CreateRoom(this.roomRepository);
      const room = await createRoom.execute({
        number,
        type,
        pricePerNight,
        currency,
        capacity,
        amenities: amenities || []
      });

      res.status(201).json({
        id: room.id,
        number: room.number,
        type: room.type,
        pricePerNight: {
          amount: room.pricePerNight.amount,
          currency: room.pricePerNight.currency
        },
        capacity: room.capacity,
        amenities: room.amenities,
        status: room.status
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const rooms = await this.roomRepository.findAll();

      res.status(200).json(
        rooms.map(room => ({
          id: room.id,
          number: room.number,
          type: room.type,
          pricePerNight: {
            amount: room.pricePerNight.amount,
            currency: room.pricePerNight.currency
          },
          capacity: room.capacity,
          amenities: room.amenities,
          status: room.status
        }))
      );
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const room = await this.roomRepository.findById(id);

      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.status(200).json({
        id: room.id,
        number: room.number,
        type: room.type,
        pricePerNight: {
          amount: room.pricePerNight.amount,
          currency: room.pricePerNight.currency
        },
        capacity: room.capacity,
        amenities: room.amenities,
        status: room.status
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  searchAvailable = async (req: Request, res: Response) => {
    try {
      const { checkInDate, checkOutDate, capacity, roomType } = req.query;

      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({ error: 'Check-in and check-out dates are required' });
      }

      const searchAvailableRooms = new SearchAvailableRooms(
        this.roomRepository,
        this.reservationRepository
      );

      const rooms = await searchAvailableRooms.execute({
        checkInDate: new Date(checkInDate as string),
        checkOutDate: new Date(checkOutDate as string),
        capacity: capacity ? parseInt(capacity as string) : undefined,
        roomType: roomType as RoomType | undefined
      });

      res.status(200).json(
        rooms.map(room => ({
          id: room.id,
          number: room.number,
          type: room.type,
          pricePerNight: {
            amount: room.pricePerNight.amount,
            currency: room.pricePerNight.currency
          },
          capacity: room.capacity,
          amenities: room.amenities,
          status: room.status
        }))
      );
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}