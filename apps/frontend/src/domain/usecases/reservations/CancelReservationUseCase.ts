import { ReservationRepository } from '../../repositories/ReservationRepository';

export class CancelReservationUseCase {
  constructor(private reservationRepository: ReservationRepository) {}

  async execute(reservationId: string) {
    if (!reservationId) {
      throw new Error('ID de reserva requerido');
    }

    return await this.reservationRepository.cancel(reservationId);
  }
}