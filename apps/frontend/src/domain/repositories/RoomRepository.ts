import { Room, RoomSearchCriteria } from '../entities/Room';

export interface CreateRoomDTO {
  number: string;
  type: 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE';
  pricePerNight: number;
  currency: string;
  capacity: number;
  amenities: string[];
}

export interface RoomRepository {
  search(criteria: RoomSearchCriteria): Promise<Room[]>;
  getAll(): Promise<Room[]>;
  getById(id: string): Promise<Room>;
  create(room: CreateRoomDTO): Promise<Room>;
}