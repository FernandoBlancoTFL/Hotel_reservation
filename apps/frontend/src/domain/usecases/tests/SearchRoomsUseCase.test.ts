import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchRoomsUseCase } from '../SearchRoomsUseCase';
import type { RoomRepository } from '../../repositories/RoomRepository';

describe('SearchRoomsUseCase', () => {
  let mockRoomRepository: RoomRepository;
  let searchRoomsUseCase: SearchRoomsUseCase;

  beforeEach(() => {
    mockRoomRepository = {
      searchRooms: vi.fn(),
      getRoomById: vi.fn(),
      createRoom: vi.fn(),
    };
    searchRoomsUseCase = new SearchRoomsUseCase(mockRoomRepository);
  });

  it('should search rooms successfully', async () => {
    const mockRooms = [
      {
        id: '1',
        number: '101',
        type: 'SINGLE' as const,
        pricePerNight: 100,
        currency: 'USD',
        capacity: 1,
        amenities: ['WiFi', 'TV'],
      },
    ];

    const searchParams = {
      checkInDate: '2024-06-01',
      checkOutDate: '2024-06-05',
      capacity: 1,
    };

    vi.mocked(mockRoomRepository.searchRooms).mockResolvedValue(mockRooms);

    const result = await searchRoomsUseCase.execute(searchParams);

    expect(mockRoomRepository.searchRooms).toHaveBeenCalledWith(searchParams);
    expect(result).toEqual(mockRooms);
  });

  it('should return empty array when no rooms available', async () => {
    vi.mocked(mockRoomRepository.searchRooms).mockResolvedValue([]);

    const result = await searchRoomsUseCase.execute({
      checkInDate: '2024-06-01',
      checkOutDate: '2024-06-05',
    });

    expect(result).toEqual([]);
  });
});