import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateReservationUseCase } from '../CreateReservationUseCase';
import type { ReservationRepository } from '../../repositories/ReservationRepository';

describe('CreateReservationUseCase', () => {
  let mockReservationRepository: ReservationRepository;
  let createReservationUseCase: CreateReservationUseCase;

  beforeEach(() => {
    mockReservationRepository = {
      createReservation: vi.fn(),
      getMyReservations: vi.fn(),
      cancelReservation: vi.fn(),
      checkIn: vi.fn(),
      checkOut: vi.fn(),
    };
    createReservationUseCase = new CreateReservationUseCase(mockReservationRepository);
  });

  it('should create reservation successfully', async () => {
    const mockReservation = {
      id: '1',
      roomId: 'room-1',
      userId: 'user-1',
      checkInDate: '2024-06-01',
      checkOutDate: '2024-06-05',
      numberOfGuests: 2,
      status: 'PENDING' as const,
      totalPrice: 400,
    };

    const reservationData = {
      roomId: 'room-1',
      checkInDate: '2024-06-01',
      checkOutDate: '2024-06-05',
      numberOfGuests: 2,
    };

    vi.mocked(mockReservationRepository.createReservation).mockResolvedValue(mockReservation);

    const result = await createReservationUseCase.execute(reservationData);

    expect(mockReservationRepository.createReservation).toHaveBeenCalledWith(reservationData);
    expect(result).toEqual(mockReservation);
  });

  it('should throw error when room is not available', async () => {
    const reservationData = {
      roomId: 'room-1',
      checkInDate: '2024-06-01',
      checkOutDate: '2024-06-05',
      numberOfGuests: 2,
    };

    vi.mocked(mockReservationRepository.createReservation).mockRejectedValue(
      new Error('Room not available')
    );

    await expect(createReservationUseCase.execute(reservationData)).rejects.toThrow(
      'Room not available'
    );
  });
});