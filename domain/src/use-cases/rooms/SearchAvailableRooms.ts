import { IRoomRepository } from '../../repositories/IRoomRepository';
import { IReservationRepository } from '../../repositories/IReservationRepository';
import { Room, RoomType } from '../../entities/Room';
import { DateRange } from '../../value-objects/DateRange';

export interface SearchAvailableRoomsDTO {
  checkInDate: Date;
  checkOutDate: Date;
  capacity?: number;
  roomType?: RoomType;
}

export class SearchAvailableRooms {
  constructor(
    private roomRepository: IRoomRepository,
    private reservationRepository: IReservationRepository
  ) {}

  async execute(data: SearchAvailableRoomsDTO): Promise<Room[]> {
    const dateRange = new DateRange(data.checkInDate, data.checkOutDate);

    // Get available rooms by status
    let availableRooms = await this.roomRepository.findAvailableRooms(dateRange, data.capacity);

    // Filter by room type if specified
    if (data.roomType) {
      availableRooms = availableRooms.filter(room => room.type === data.roomType);
    }

    // Filter out rooms with overlapping reservations
    const roomsWithoutConflicts: Room[] = [];
    for (const room of availableRooms) {
      const overlappingReservations = await this.reservationRepository.findReservationsByRoomAndDateRange(
        room.id,
        dateRange
      );
      
      if (overlappingReservations.length === 0) {
        roomsWithoutConflicts.push(room);
      }
    }

    return roomsWithoutConflicts;
  }
}