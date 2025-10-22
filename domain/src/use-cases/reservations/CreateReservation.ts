import { IRoomRepository } from '../../repositories/IRoomRepository';
import { IReservationRepository } from '../../repositories/IReservationRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { Reservation } from '../../entities/Reservation';
import { DateRange } from '../../value-objects/DateRange';
import { PricingService } from '../../services/PricingService';
import { v4 as uuidv4 } from 'uuid';

export interface CreateReservationDTO {
  userId: string;
  roomId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
}

export class CreateReservation {
  constructor(
    private roomRepository: IRoomRepository,
    private reservationRepository: IReservationRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: CreateReservationDTO): Promise<Reservation> {
    // Verify user exists
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verify room exists
    const room = await this.roomRepository.findById(data.roomId);
    if (!room) {
      throw new Error('Room not found');
    }

    // Check if room is available
    if (!room.isAvailable()) {
      throw new Error('Room is not available');
    }

    // Check if room can accommodate guests
    if (!room.canAccommodate(data.numberOfGuests)) {
      throw new Error('Number of guests exceeds room capacity');
    }

    // Create date range
    const dateRange = new DateRange(data.checkInDate, data.checkOutDate);

    // Check for overlapping reservations
    const overlappingReservations = await this.reservationRepository.findReservationsByRoomAndDateRange(
      data.roomId,
      dateRange
    );

    if (overlappingReservations.length > 0) {
      throw new Error('Room is already reserved for these dates');
    }

    // Calculate total price
    const totalPrice = PricingService.calculateTotalPrice(room.pricePerNight, dateRange);

    // Create reservation
    const reservation = new Reservation(
      uuidv4(),
      data.userId,
      data.roomId,
      dateRange,
      data.numberOfGuests,
      totalPrice
    );

    // Save reservation
    await this.reservationRepository.save(reservation);

    return reservation;
  }
}