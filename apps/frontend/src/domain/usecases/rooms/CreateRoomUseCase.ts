import { RoomRepository, CreateRoomDTO } from '../../repositories/RoomRepository';

export class CreateRoomUseCase {
  constructor(private roomRepository: RoomRepository) {}

  async execute(room: CreateRoomDTO) {
    if (!room.number || !room.type || !room.pricePerNight) {
      throw new Error('Número, tipo y precio son requeridos');
    }

    if (room.pricePerNight <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }

    if (room.capacity <= 0) {
      throw new Error('La capacidad debe ser mayor a 0');
    }

    return await this.roomRepository.create(room);
  }
}