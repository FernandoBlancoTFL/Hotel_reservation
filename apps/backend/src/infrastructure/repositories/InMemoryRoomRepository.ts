import { IRoomRepository } from '@hotel/domain/src/repositories/IRoomRepository';
import { Room, RoomType, RoomStatus } from '@hotel/domain/src/entities/Room';
import { DateRange } from '@hotel/domain/src/value-objects/DateRange';

export class InMemoryRoomRepository implements IRoomRepository {
  private rooms: Map<string, Room> = new Map();

  async save(room: Room): Promise<void> {
    this.rooms.set(room.id, room);
  }

  async findById(id: string): Promise<Room | null> {
    return this.rooms.get(id) || null;
  }

  async findByNumber(number: string): Promise<Room | null> {
    for (const room of this.rooms.values()) {
      if (room.number === number) {
        return room;
      }
    }
    return null;
  }

  async update(room: Room): Promise<void> {
    if (!this.rooms.has(room.id)) {
      throw new Error('Room not found');
    }
    this.rooms.set(room.id, room);
  }

  async delete(id: string): Promise<void> {
    this.rooms.delete(id);
  }

  async findAll(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async findByType(type: RoomType): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(room => room.type === type);
  }

  async findByStatus(status: RoomStatus): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(room => room.status === status);
  }

  async findAvailableRooms(dateRange: DateRange, capacity?: number): Promise<Room[]> {
    return Array.from(this.rooms.values()).filter(room => {
      if (!room.isAvailable()) return false;
      if (capacity && !room.canAccommodate(capacity)) return false;
      return true;
    });
  }
}