import { RoomRepository } from '../../repositories/RoomRepository';
import { RoomSearchCriteria } from '../../entities/Room';

export class SearchRoomsUseCase {
  constructor(private roomRepository: RoomRepository) {}

  async execute(criteria: RoomSearchCriteria) {
    if (!criteria.checkInDate || !criteria.checkOutDate) {
      throw new Error('Las fechas de check-in y check-out son requeridas');
    }

    const checkIn = new Date(criteria.checkInDate);
    const checkOut = new Date(criteria.checkOutDate);

    if (checkIn >= checkOut) {
      throw new Error('La fecha de check-out debe ser posterior a la de check-in');
    }

    if (checkIn < new Date()) {
      throw new Error('La fecha de check-in no puede ser en el pasado');
    }

    return await this.roomRepository.search(criteria);
  }
}