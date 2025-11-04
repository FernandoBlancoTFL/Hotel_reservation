import { ReservationRepository } from '@domain/repositories/ReservationRepository';
import { Reservation, CreateReservationDTO } from '@domain/entities/Reservation';
import { apiClient } from '../api/apiClient';

export class ReservationRepositoryImpl implements ReservationRepository {
  async create(reservation: CreateReservationDTO): Promise<Reservation> {
    try {
      return await apiClient.post<Reservation>('/api/reservations', reservation);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear reserva');
    }
  }

  async getMyReservations(): Promise<Reservation[]> {
    try {
      return await apiClient.get<Reservation[]>('/api/reservations/my-reservations');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener reservas');
    }
  }

  async getAllReservations(): Promise<Reservation[]> {
    try {
      return await apiClient.get<Reservation[]>('/api/reservations');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al obtener todas las reservas');
    }
  }

  async cancel(id: string): Promise<void> {
    try {
      await apiClient.post(`/api/reservations/${id}/cancel`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al cancelar reserva');
    }
  }

  async checkIn(id: string): Promise<Reservation> {
    try {
      return await apiClient.post<Reservation>(`/api/reservations/${id}/check-in`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al hacer check-in');
    }
  }

  async checkOut(id: string): Promise<Reservation> {
    try {
      return await apiClient.post<Reservation>(`/api/reservations/${id}/check-out`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al hacer check-out');
    }
  }
}