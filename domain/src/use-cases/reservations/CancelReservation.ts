import { IReservationRepository } from '../../repositories/IReservationRepository';
import { IUserRepository } from '../../repositories/IUserRepository';
import { Reservation } from '../../entities/Reservation';

export interface CancelReservationDTO {
  reservationId: string;
  userId: string;
}

export class CancelReservation {
  constructor(
    private reservationRepository: IReservationRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(data: CancelReservationDTO): Promise<Reservation> {
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
    const canCancelOwn = user.can('CANCEL_OWN_RESERVATION') && reservation.userId === user.id;
    const canCancelAny = user.can('CANCEL_ANY_RESERVATION');

    if (!canCancelOwn && !canCancelAny) {
      throw new Error('User does not have permission to cancel this reservation');
    }

    // Cancel reservation
    reservation.cancel();

    // Update reservation
    await this.reservationRepository.update(reservation);

    return reservation;
  }
}