import { ReservationRepository } from '../../repositories/ReservationRepository';

export class GetMyReservationsUseCase {
  constructor(private reservationRepository: ReservationRepository) {}

  async execute() {
    return await this.reservationRepository.getMyReservations();
  }
}