import { IRoomRepository } from '@hotel/domain/src/repositories/IRoomRepository';
import { Room, RoomType, RoomStatus } from '@hotel/domain/src/entities/Room';
import { DateRange } from '@hotel/domain/src/value-objects/DateRange';
import { Money } from '@hotel/domain/src/value-objects/Money';
import { Pool } from 'pg';

export class PostgresRoomRepository implements IRoomRepository {
  constructor(private pool: Pool) {}

  async save(room: Room): Promise<void> {
    const query = `
      INSERT INTO rooms (id, number, type, price_amount, price_currency, capacity, amenities, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    
    await this.pool.query(query, [
      room.id,
      room.number,
      room.type,
      room.pricePerNight.amount,
      room.pricePerNight.currency,
      room.capacity,
      JSON.stringify(room.amenities),
      room.status
    ]);
  }

  async findById(id: string): Promise<Room | null> {
    const query = 'SELECT * FROM rooms WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    
    return this.mapToRoom(result.rows[0]);
  }

  async findByNumber(number: string): Promise<Room | null> {
    const query = 'SELECT * FROM rooms WHERE number = $1';
    const result = await this.pool.query(query, [number]);
    
    if (result.rows.length === 0) return null;
    
    return this.mapToRoom(result.rows[0]);
  }

  async update(room: Room): Promise<void> {
    const query = `
      UPDATE rooms 
      SET number = $2, type = $3, price_amount = $4, price_currency = $5, 
          capacity = $6, amenities = $7, status = $8
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [
      room.id,
      room.number,
      room.type,
      room.pricePerNight.amount,
      room.pricePerNight.currency,
      room.capacity,
      JSON.stringify(room.amenities),
      room.status
    ]);

    if (result.rowCount === 0) {
      throw new Error('Room not found');
    }
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM rooms WHERE id = $1';
    await this.pool.query(query, [id]);
  }

  async findAll(): Promise<Room[]> {
    const query = 'SELECT * FROM rooms ORDER BY number';
    const result = await this.pool.query(query);
    
    return result.rows.map(row => this.mapToRoom(row));
  }

  async findByType(type: RoomType): Promise<Room[]> {
    const query = 'SELECT * FROM rooms WHERE type = $1 ORDER BY number';
    const result = await this.pool.query(query, [type]);
    
    return result.rows.map(row => this.mapToRoom(row));
  }

  async findByStatus(status: RoomStatus): Promise<Room[]> {
    const query = 'SELECT * FROM rooms WHERE status = $1 ORDER BY number';
    const result = await this.pool.query(query, [status]);
    
    return result.rows.map(row => this.mapToRoom(row));
  }

  async findAvailableRooms(dateRange: DateRange, capacity?: number): Promise<Room[]> {
    let query = 'SELECT * FROM rooms WHERE status = $1';
    const params: any[] = [RoomStatus.AVAILABLE];
    
    if (capacity) {
      query += ' AND capacity >= $2';
      params.push(capacity);
    }
    
    query += ' ORDER BY number';
    
    const result = await this.pool.query(query, params);
    return result.rows.map(row => this.mapToRoom(row));
  }

  private mapToRoom(row: any): Room {
    const money = new Money(parseFloat(row.price_amount), row.price_currency);
    const amenities = JSON.parse(row.amenities);
    
    const room = new Room(
      row.id,
      row.number,
      row.type as RoomType,
      money,
      row.capacity,
      amenities
    );

    // Set status using the status property
    if (row.status === RoomStatus.OCCUPIED) {
      room.markAsOccupied();
    } else if (row.status === RoomStatus.MAINTENANCE) {
      room.markAsInMaintenance();
    }

    return room;
  }
}