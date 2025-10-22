import { SearchAvailableRooms } from '../../../src/use-cases/rooms/SearchAvailableRooms';
import { CreateRoom } from '../../../src/use-cases/rooms/CreateRoom';
import { IRoomRepository } from '../../../src/repositories/IRoomRepository';
import { IReservationRepository } from '../../../src/repositories/IReservationRepository';
import { Room, RoomType, RoomStatus } from '../../../src/entities/Room';
import { Reservation, ReservationStatus } from '../../../src/entities/Reservation';
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

class MockReservationRepository implements IReservationRepository {
  private reservations: Reservation[] = [];

  async save(reservation: Reservation): Promise<void> {
    this.reservations.push(reservation);
  }

  async findById(id: string): Promise<Reservation | null> {
    return this.reservations.find(r => r.id === id) || null;
  }

  async update(reservation: Reservation): Promise<void> {
    const index = this.reservations.findIndex(r => r.id === reservation.id);
    if (index !== -1) {
      this.reservations[index] = reservation;
    }
  }

  async delete(id: string): Promise<void> {
    this.reservations = this.reservations.filter(r => r.id !== id);
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    return this.reservations.filter(r => r.userId === userId);
  }

  async findByRoomId(roomId: string): Promise<Reservation[]> {
    return this.reservations.filter(r => r.roomId === roomId);
  }

  async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
    return this.reservations.filter(r => r.status === status);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservations;
  }

  async findActiveReservationsByRoomId(roomId: string): Promise<Reservation[]> {
    return this.reservations.filter(r => r.roomId === roomId && r.isActive());
  }

  async findReservationsByRoomAndDateRange(roomId: string, dateRange: DateRange): Promise<Reservation[]> {
    return this.reservations.filter(r => {
      if (r.roomId !== roomId) return false;
      if (!r.isActive()) return false;
      return r.dateRange.overlaps(dateRange);
    });
  }

  reset() {
    this.reservations = [];
  }
}

describe('SearchAvailableRooms Use Case', () => {
  let roomRepository: MockRoomRepository;
  let reservationRepository: MockReservationRepository;
  let createRoom: CreateRoom;
  let searchAvailableRooms: SearchAvailableRooms;

  beforeEach(() => {
    roomRepository = new MockRoomRepository();
    reservationRepository = new MockReservationRepository();
    createRoom = new CreateRoom(roomRepository);
    searchAvailableRooms = new SearchAvailableRooms(roomRepository, reservationRepository);
  });

  it('should find available rooms for date range', async () => {
    await createRoom.execute({
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: ['WiFi']
    });

    await createRoom.execute({
      number: '102',
      type: RoomType.DOUBLE,
      pricePerNight: 150,
      currency: 'USD',
      capacity: 2,
      amenities: ['WiFi', 'TV']
    });

    const dateRange = new DateRange(
      new Date('2024-06-01'),
      new Date('2024-06-05')
    );

    const rooms = await searchAvailableRooms.execute({
      checkInDate: new Date('2024-06-01'),
      checkOutDate: new Date('2024-06-05')
    });

    expect(rooms.length).toBe(2);
  });

  it('should filter rooms by capacity', async () => {
    await createRoom.execute({
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: []
    });

    await createRoom.execute({
      number: '102',
      type: RoomType.DOUBLE,
      pricePerNight: 150,
      currency: 'USD',
      capacity: 2,
      amenities: []
    });

    const rooms = await searchAvailableRooms.execute({
      checkInDate: new Date('2024-06-01'),
      checkOutDate: new Date('2024-06-05'),
      capacity: 2
    });

    expect(rooms.length).toBe(1);
    expect(rooms[0].number).toBe('102');
  });

  it('should filter rooms by type', async () => {
    await createRoom.execute({
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: []
    });

    await createRoom.execute({
      number: '102',
      type: RoomType.DOUBLE,
      pricePerNight: 150,
      currency: 'USD',
      capacity: 2,
      amenities: []
    });

    const rooms = await searchAvailableRooms.execute({
      checkInDate: new Date('2024-06-01'),
      checkOutDate: new Date('2024-06-05'),
      roomType: RoomType.SINGLE
    });

    expect(rooms.length).toBe(1);
    expect(rooms[0].type).toBe(RoomType.SINGLE);
  });

  it('should throw error for invalid date range', async () => {
    await expect(searchAvailableRooms.execute({
      checkInDate: new Date('2024-06-05'),
      checkOutDate: new Date('2024-06-01')
    })).rejects.toThrow('End date must be after start date');
  });
});