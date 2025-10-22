import { IReservationRepository } from '../../repositories/IReservationRepository';
import { IRoomRepository } from '../../repositories/IRoomRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { Reservation } from '../../entities/Reservation';

export interface CheckOutReservationDTO {
  reservationId: string;
  userId: string;
}

export class CheckOutReservation {
  constructor(
    private reservationRepository: IReservationRepository,
    private roomRepository: IRoomRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: CheckOutReservationDTO): Promise<Reservation> {
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
    if (!user.can('CHECK_OUT')) {
      throw new Error('User does not have permission to check out reservations');
    }

    // Check out reservation
    reservation.checkOut();

    // Update room status to available
    const room = await this.roomRepository.findById(reservation.roomId);
    if (room) {
      room.markAsAvailable();
      await this.roomRepository.update(room);
    }

    // Update reservation
    await this.reservationRepository.update(reservation);

    return reservation;
  }
}