import { IRoomRepository } from '../../repositories/IRoomRepository';
import { Room, RoomType } from '../../entities/Room';
import { Money } from '../../value-objects/Money';
import { v4 as uuidv4 } from 'uuid';

export interface CreateRoomDTO {
  number: string;
  type: RoomType;
  pricePerNight: number;
  currency: string;
  capacity: number;
  amenities: string[];
}

export class CreateRoom {
  constructor(private roomRepository: IRoomRepository) {}

  async execute(data: CreateRoomDTO): Promise<Room> {
    // Check if room number already exists
    const existingRoom = await this.roomRepository.findByNumber(data.number);
    if (existingRoom) {
      throw new Error(`Room with number ${data.number} already exists`);
    }

    // Create price value object
    const price = new Money(data.pricePerNight, data.currency);

    // Create room entity
    const room = new Room(
      uuidv4(),
      data.number,
      data.type,
      price,
      data.capacity,
      data.amenities
    );

    // Save room
    await this.roomRepository.save(room);

    return room;
  }
}