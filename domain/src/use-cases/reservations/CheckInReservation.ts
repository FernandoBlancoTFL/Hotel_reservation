import { IReservationRepository } from '../../repositories/IReservationRepository';
import { IRoomRepository } from '../../repositories/IRoomRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { Reservation } from '../../entities/Reservation';

export interface CheckInReservationDTO {
  reservationId: string;
  userId: string;
}

export class CheckInReservation {
  constructor(
    private reservationRepository: IReservationRepository,
    private roomRepository: IRoomRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: CheckInReservationDTO): Promise<Reservation> {
    // Find reservation
    const reservation = await this.reservationRepository.findById(data.reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    // Find user
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Check permissions
    if (!user.can('CHECK_IN')) {
      throw new Error('User does not have permission to check in reservations');
    }

    // Check in reservation
    reservation.checkIn();

    // Update room status to occupied
    const room = await this.roomRepository.findById(reservation.roomId);
    if (room) {
      room.markAsOccupied();
      await this.roomRepository.update(room);
    }

    // Update reservation
    await this.reservationRepository.update(reservation);

    return reservation;
  }
}