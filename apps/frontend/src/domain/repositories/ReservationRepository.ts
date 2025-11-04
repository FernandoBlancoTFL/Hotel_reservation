import { Reservation, CreateReservationDTO } from '../entities/Reservation';

export interface ReservationRepository {
  create(reservation: CreateReservationDTO): Promise<Reservation>;
  getMyReservations(): Promise<Reservation[]>;
  getAllReservations(): Promise<Reservation[]>;
  cancel(id: string): Promise<void>;
  checkIn(id: string): Promise<Reservation>;
  checkOut(id: string): Promise<Reservation>;
}