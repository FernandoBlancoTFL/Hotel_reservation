import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoomRepositoryImpl } from '../RoomRepositoryImpl';
import type { ApiClient } from '../../api/ApiClient';

describe('RoomRepositoryImpl', () => {
  let mockApiClient: ApiClient;
  let roomRepository: RoomRepositoryImpl;

  beforeEach(() => {
    mockApiClient = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as any;
    roomRepository = new RoomRepositoryImpl(mockApiClient);
  });

  it('should search rooms successfully', async () => {
    const mockRooms = [
      {
        id: '1',
        number: '101',
        type: 'SINGLE',
        pricePerNight: 100,
        currency: 'USD',
        capacity: 1,
        amenities: ['WiFi', 'TV'],
      },
    ];

    vi.mocked(mockApiClient.get).mockResolvedValue(mockRooms);

    const params = {
      checkInDate: '2024-06-01',
      checkOutDate: '2024-06-05',
      capacity: 1,
    };

    const result = await roomRepository.searchRooms(params);

    expect(mockApiClient.get).toHaveBeenCalledWith('/rooms/search', { params });
    expect(result).toEqual(mockRooms);
  });

  it('should get room by id', async () => {
    const mockRoom = {
      id: '1',
      number: '101',
      type: 'SINGLE',
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: ['WiFi', 'TV'],
    };

    vi.mocked(mockApiClient.get).mockResolvedValue(mockRoom);

    const result = await roomRepository.getRoomById('1');

    expect(mockApiClient.get).toHaveBeenCalledWith('/rooms/1');
    expect(result).toEqual(mockRoom);
  });

  it('should create room successfully', async () => {
    const newRoom = {
      number: '102',
      type: 'DOUBLE' as const,
      pricePerNight: 150,
      currency: 'USD',
      capacity: 2,
      amenities: ['WiFi', 'TV', 'MiniBar'],
    };

    const mockCreatedRoom = { id: '2', ...newRoom };

    vi.mocked(mockApiClient.post).mockResolvedValue(mockCreatedRoom);

    const result = await roomRepository.createRoom(newRoom);

    expect(mockApiClient.post).toHaveBeenCalledWith('/rooms', newRoom);
    expect(result).toEqual(mockCreatedRoom);
  });
});