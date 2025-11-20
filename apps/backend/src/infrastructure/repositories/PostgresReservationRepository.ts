import { IReservationRepository } from '@hotel/domain/src/repositories/IReservationRepository';
import { Reservation, ReservationStatus } from '@hotel/domain/src/entities/Reservation';
import { DateRange } from '@hotel/domain/src/value-objects/DateRange';
import { Money } from '@hotel/domain/src/value-objects/Money';
import { Pool } from 'pg';

export class PostgresReservationRepository implements IReservationRepository {
  constructor(private pool: Pool) {}

  async save(reservation: Reservation): Promise<void> {
    const query = `
      INSERT INTO reservations (id, user_id, room_id, check_in_date, check_out_date, number_of_guests, status, total_price_amount, total_price_currency)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    
    await this.pool.query(query, [
      reservation.id,
      reservation.userId,
      reservation.roomId,
      reservation.dateRange.startDate,
      reservation.dateRange.endDate,
      reservation.numberOfGuests,
      reservation.status,
      reservation.totalPrice.amount,
      reservation.totalPrice.currency
    ]);
  }

  async findById(id: string): Promise<Reservation | null> {
    const query = 'SELECT * FROM reservations WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    
    return this.mapToReservation(result.rows[0]);
  }

  async update(reservation: Reservation): Promise<void> {
    const query = `
      UPDATE reservations 
      SET user_id = $2, room_id = $3, check_in_date = $4, check_out_date = $5, 
          number_of_guests = $6, status = $7, total_price_amount = $8, total_price_currency = $9
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [
      reservation.id,
      reservation.userId,
      reservation.roomId,
      reservation.dateRange.startDate,
      reservation.dateRange.endDate,
      reservation.numberOfGuests,
      reservation.status,
      reservation.totalPrice.amount,
      reservation.totalPrice.currency
    ]);

    if (result.rowCount === 0) {
      throw new Error('Reservation not found');
    }
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM reservations WHERE id = $1';
    await this.pool.query(query, [id]);
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const query = 'SELECT * FROM reservations WHERE user_id = $1 ORDER BY check_in_date DESC';
    const result = await this.pool.query(query, [userId]);
    
    return result.rows.map(row => this.mapToReservation(row));
  }

  async findByGuestId(guestId: string): Promise<Reservation[]> {
    return this.findByUserId(guestId);
  }

  async findByRoomId(roomId: string): Promise<Reservation[]> {
    const query = 'SELECT * FROM reservations WHERE room_id = $1 ORDER BY check_in_date DESC';
    const result = await this.pool.query(query, [roomId]);
    
    return result.rows.map(row => this.mapToReservation(row));
  }

  async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
    const query = 'SELECT * FROM reservations WHERE status = $1 ORDER BY check_in_date DESC';
    const result = await this.pool.query(query, [status]);
    
    return result.rows.map(row => this.mapToReservation(row));
  }

  async findAll(): Promise<Reservation[]> {
    const query = 'SELECT * FROM reservations ORDER BY check_in_date DESC';
    const result = await this.pool.query(query);
    
    return result.rows.map(row => this.mapToReservation(row));
  }

  async findByDateRange(dateRange: DateRange): Promise<Reservation[]> {
    const query = `
      SELECT * FROM reservations 
      WHERE (check_in_date <= $2 AND check_out_date >= $1)
      AND status NOT IN ('CANCELLED')
      ORDER BY check_in_date
    `;
    
    const result = await this.pool.query(query, [
      dateRange.startDate,
      dateRange.endDate
    ]);
    
    return result.rows.map(row => this.mapToReservation(row));
  }

  async findActiveReservationsByRoomId(roomId: string): Promise<Reservation[]> {
    const query = `
      SELECT * FROM reservations 
      WHERE room_id = $1 
      AND status NOT IN ('CANCELLED', 'COMPLETED')
      ORDER BY check_in_date
    `;
    
    const result = await this.pool.query(query, [roomId]);
    return result.rows.map(row => this.mapToReservation(row));
  }

  async findReservationsByRoomAndDateRange(roomId: string, dateRange: DateRange): Promise<Reservation[]> {
    const query = `
      SELECT * FROM reservations 
      WHERE room_id = $1 
      AND (check_in_date <= $3 AND check_out_date >= $2)
      AND status NOT IN ('CANCELLED', 'COMPLETED')
      ORDER BY check_in_date
    `;
    
    const result = await this.pool.query(query, [
      roomId,
      dateRange.startDate,
      dateRange.endDate
    ]);
    
    return result.rows.map(row => this.mapToReservation(row));
  }

  private mapToReservation(row: any): Reservation {
    const dateRange = new DateRange(
      new Date(row.check_in_date),
      new Date(row.check_out_date)
    );

    const money = new Money(parseFloat(row.total_price_amount), row.total_price_currency);

    const reservation = new Reservation(
      row.id,
      row.user_id,
      row.room_id,
      dateRange,
      row.number_of_guests,
      money
    );

    // Set the correct status
    switch (row.status) {
      case ReservationStatus.CHECKED_IN:
        reservation.checkIn();
        break;
      case ReservationStatus.CHECKED_OUT:
        reservation.checkOut();
        break;
      case ReservationStatus.CANCELLED:
        reservation.cancel();
        break;
    }

    return reservation;
  }
}