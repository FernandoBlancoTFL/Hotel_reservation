import { Reservation, ReservationStatus } from '../entities/Reservation';
import { DateRange } from '../value-objects/DateRange';

export interface IReservationRepository {
  save(reservation: Reservation): Promise<void>;
  findById(id: string): Promise<Reservation | null>;
  update(reservation: Reservation): Promise<void>;
  delete(id: string): Promise<void>;
  findByUserId(userId: string): Promise<Reservation[]>;
  findByRoomId(roomId: string): Promise<Reservation[]>;
  findByStatus(status: ReservationStatus): Promise<Reservation[]>;
  findAll(): Promise<Reservation[]>;
  findActiveReservationsByRoomId(roomId: string): Promise<Reservation[]>;
  findReservationsByRoomAndDateRange(roomId: string, dateRange: DateRange): Promise<Reservation[]>;
}