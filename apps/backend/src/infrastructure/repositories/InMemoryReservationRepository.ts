import { IReservationRepository } from '@hotel/domain/src/repositories/IReservationRepository';
import { Reservation, ReservationStatus } from '@hotel/domain/src/entities/Reservation';
import { DateRange } from '@hotel/domain/src/value-objects/DateRange';

export class InMemoryReservationRepository implements IReservationRepository {
  private reservations: Map<string, Reservation> = new Map();

  async save(reservation: Reservation): Promise<void> {
    this.reservations.set(reservation.id, reservation);
  }

  async findById(id: string): Promise<Reservation | null> {
    return this.reservations.get(id) || null;
  }

  async update(reservation: Reservation): Promise<void> {
    if (!this.reservations.has(reservation.id)) {
      throw new Error('Reservation not found');
    }
    this.reservations.set(reservation.id, reservation);
  }

  async delete(id: string): Promise<void> {
    this.reservations.delete(id);
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      reservation => reservation.userId === userId
    );
  }

  async findByRoomId(roomId: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      reservation => reservation.roomId === roomId
    );
  }

  async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      reservation => reservation.status === status
    );
  }

  async findAll(): Promise<Reservation[]> {
    return Array.from(this.reservations.values());
  }

  async findActiveReservationsByRoomId(roomId: string): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(
      reservation => reservation.roomId === roomId && reservation.isActive()
    );
  }

  async findReservationsByRoomAndDateRange(
    roomId: string,
    dateRange: DateRange
  ): Promise<Reservation[]> {
    return Array.from(this.reservations.values()).filter(reservation => {
      if (reservation.roomId !== roomId) return false;
      if (!reservation.isActive()) return false;
      return reservation.dateRange.overlaps(dateRange);
    });
  }
}