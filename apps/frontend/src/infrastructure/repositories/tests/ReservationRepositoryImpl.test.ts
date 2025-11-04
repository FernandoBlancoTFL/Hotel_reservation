import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReservationRepositoryImpl } from '../ReservationRepositoryImpl';
import type { ApiClient } from '../../api/ApiClient';

describe('ReservationRepositoryImpl', () => {
  let mockApiClient: ApiClient;
  let reservationRepository: ReservationRepositoryImpl;

  beforeEach(() => {
    mockApiClient = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as any;
    reservationRepository = new ReservationRepositoryImpl(mockApiClient);
  });

  it('should create reservation successfully', async () => {
    const mockReservation = {
      id: '1',
      roomId: 'room-1',
      userId: 'user-1',
      checkInDate: '2024-06-01',
      checkOutDate: '2024-06-05',
      numberOfGuests: 2,
      status: 'PENDING',
      totalPrice: 400,
    };

    const reservationData = {
      roomId: 'room-1',
      checkInDate: '2024-06-01',
      checkOutDate: '2024-06-05',
      numberOfGuests: 2,
    };

    vi.mocked(mockApiClient.post).mockResolvedValue(mockReservation);

    const result = await reservationRepository.createReservation(reservationData);

    expect(mockApiClient.post).toHaveBeenCalledWith('/reservations', reservationData);
    expect(result).toEqual(mockReservation);
  });

  it('should get my reservations', async () => {
    const mockReservations = [
      {
        id: '1',
        roomId: 'room-1',
        userId: 'user-1',
        checkInDate: '2024-06-01',
        checkOutDate: '2024-06-05',
        numberOfGuests: 2,
        status: 'PENDING',
        totalPrice: 400,
      },
    ];

    vi.mocked(mockApiClient.get).mockResolvedValue(mockReservations);

    const result = await reservationRepository.getMyReservations();

    expect(mockApiClient.get).toHaveBeenCalledWith('/reservations/my-reservations');
    expect(result).toEqual(mockReservations);
  });

  it('should cancel reservation', async () => {
    const mockCancelledReservation = {
      id: '1',
      status: 'CANCELLED',
    };

    vi.mocked(mockApiClient.post).mockResolvedValue(mockCancelledReservation);

    const result = await reservationRepository.cancelReservation('1');

    expect(mockApiClient.post).toHaveBeenCalledWith('/reservations/1/cancel');
    expect(result).toEqual(mockCancelledReservation);
  });

  it('should check in reservation', async () => {
    const mockCheckedInReservation = {
      id: '1',
      status: 'CHECKED_IN',
    };

    vi.mocked(mockApiClient.post).mockResolvedValue(mockCheckedInReservation);

    const result = await reservationRepository.checkIn('1');

    expect(mockApiClient.post).toHaveBeenCalledWith('/reservations/1/check-in');
    expect(result).toEqual(mockCheckedInReservation);
  });

  it('should check out reservation', async () => {
    const mockCheckedOutReservation = {
      id: '1',
      status: 'CHECKED_OUT',
    };

    vi.mocked(mockApiClient.post).mockResolvedValue(mockCheckedOutReservation);

    const result = await reservationRepository.checkOut('1');

    expect(mockApiClient.post).toHaveBeenCalledWith('/reservations/1/check-out');
    expect(result).toEqual(mockCheckedOutReservation);
  });
});