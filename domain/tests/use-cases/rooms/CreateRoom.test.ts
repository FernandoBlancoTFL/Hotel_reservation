import { CreateRoom } from '../../../src/use-cases/rooms/CreateRoom';
import { IRoomRepository } from '../../../src/repositories/IRoomRepository';
import { Room, RoomType, RoomStatus } from '../../../src/entities/Room';
import { DateRange } from '../../../src/value-objects/DateRange';

class MockRoomRepository implements IRoomRepository {
  private rooms: Room[] = [];

  async save(room: Room): Promise<void> {
    this.rooms.push(room);
  }

  async findById(id: string): Promise<Room | null> {
    return this.rooms.find(r => r.id === id) || null;
  }

  async findByNumber(number: string): Promise<Room | null> {
    return this.rooms.find(r => r.number === number) || null;
  }

  async update(room: Room): Promise<void> {
    const index = this.rooms.findIndex(r => r.id === room.id);
    if (index !== -1) {
      this.rooms[index] = room;
    }
  }

  async delete(id: string): Promise<void> {
    this.rooms = this.rooms.filter(r => r.id !== id);
  }

  async findAll(): Promise<Room[]> {
    return this.rooms;
  }

  async findByType(type: RoomType): Promise<Room[]> {
    return this.rooms.filter(r => r.type === type);
  }

  async findByStatus(status: RoomStatus): Promise<Room[]> {
    return this.rooms.filter(r => r.status === status);
  }

  async findAvailableRooms(dateRange: DateRange, capacity?: number): Promise<Room[]> {
    return this.rooms.filter(r => {
      if (!r.isAvailable()) return false;
      if (capacity && !r.canAccommodate(capacity)) return false;
      return true;
    });
  }

  reset() {
    this.rooms = [];
  }
}

describe('CreateRoom Use Case', () => {
  let roomRepository: MockRoomRepository;
  let createRoom: CreateRoom;

  beforeEach(() => {
    roomRepository = new MockRoomRepository();
    createRoom = new CreateRoom(roomRepository);
  });

  it('should create a room successfully', async () => {
    const roomData = {
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: ['WiFi', 'TV']
    };

    const room = await createRoom.execute(roomData);

    expect(room.number).toBe('101');
    expect(room.type).toBe(RoomType.SINGLE);
    expect(room.pricePerNight.amount).toBe(100);
    expect(room.capacity).toBe(1);
    expect(room.amenities).toEqual(['WiFi', 'TV']);
  });

  it('should throw error if room number already exists', async () => {
    const roomData = {
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: ['WiFi']
    };

    await createRoom.execute(roomData);

    await expect(createRoom.execute(roomData))
      .rejects.toThrow('Room with number 101 already exists');
  });

  it('should throw error for invalid price', async () => {
    const roomData = {
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: -10,
      currency: 'USD',
      capacity: 1,
      amenities: []
    };

    await expect(createRoom.execute(roomData))
      .rejects.toThrow('Amount cannot be negative');
  });

  it('should throw error for invalid capacity', async () => {
    const roomData = {
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 0,
      amenities: []
    };

    await expect(createRoom.execute(roomData))
      .rejects.toThrow('Capacity must be at least 1');
  });

  it('should create room with empty amenities list', async () => {
    const roomData = {
      number: '102',
      type: RoomType.DOUBLE,
      pricePerNight: 150,
      currency: 'USD',
      capacity: 2,
      amenities: []
    };

    const room = await createRoom.execute(roomData);

    expect(room.amenities).toEqual([]);
  });
});