import { RoomRepository, CreateRoomDTO } from '@domain/repositories/RoomRepository';
import { Room, RoomSearchCriteria } from '@domain/entities/Room';
import { apiClient } from '../api/apiClient';

export class RoomRepositoryImpl implements RoomRepository {
  async search(criteria: RoomSearchCriteria): Promise<Room[]> {
    try {
      const params = new URLSearchParams();
      params.append('checkInDate', criteria.checkInDate);
      params.append('checkOutDate', criteria.checkOutDate);
      
      if (criteria.capacity) {
        params.append('capacity', criteria.capacity.toString());
      }
      
      if (criteria.roomType) {
        params.append('roomType', criteria.roomType);
      }

      return await apiClient.get<Room[]>(`/api/rooms/search?${params.toString()}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al buscar habitaciones');
    }
  }

  async getAll(): Promise<Room[]> {
    try {
      return await apiClient.get<Room[]>('/api/rooms');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener habitaciones');
    }
  }

  async getById(id: string): Promise<Room> {
    try {
      return await apiClient.get<Room>(`/api/rooms/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener habitación');
    }
  }

  async create(room: CreateRoomDTO): Promise<Room> {
    try {
      return await apiClient.post<Room>('/api/rooms', room);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear habitación');
    }
  }
}