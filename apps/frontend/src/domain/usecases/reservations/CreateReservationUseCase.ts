import { ReservationRepository } from '../../repositories/ReservationRepository';
import { CreateReservationDTO } from '../../entities/Reservation';

export class CreateReservationUseCase {
  constructor(private reservationRepository: ReservationRepository) {}

  async execute(reservation: CreateReservationDTO) {
    if (!reservation.roomId || !reservation.checkInDate || !reservation.checkOutDate) {
      throw new Error('Todos los campos son requeridos');
    }

    const checkIn = new Date(reservation.checkInDate);
    const checkOut = new Date(reservation.checkOutDate);

    if (checkIn >= checkOut) {
      throw new Error('La fecha de check-out debe ser posterior a la de check-in');
    }

    if (reservation.numberOfGuests <= 0) {
      throw new Error('El número de huéspedes debe ser mayor a 0');
    }

    return await this.reservationRepository.create(reservation);
  }
}