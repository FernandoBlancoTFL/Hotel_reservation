import { Room, RoomType, RoomStatus } from '../entities/Room';
import { DateRange } from '../value-objects/DateRange';

export interface IRoomRepository {
  save(room: Room): Promise<void>;
  findById(id: string): Promise<Room | null>;
  findByNumber(number: string): Promise<Room | null>;
  update(room: Room): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Room[]>;
  findByType(type: RoomType): Promise<Room[]>;
  findByStatus(status: RoomStatus): Promise<Room[]>;
  findAvailableRooms(dateRange: DateRange, capacity?: number): Promise<Room[]>;
}