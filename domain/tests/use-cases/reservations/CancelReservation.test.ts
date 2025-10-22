import { CreateReservation } from '../../../src/use-cases/reservations/CreateReservation';
import { CancelReservation } from '../../../src/use-cases/reservations/CancelReservation';
import { CreateRoom } from '../../../src/use-cases/rooms/CreateRoom';
import { RegisterUser } from '../../../src/use-cases/auth/RegisterUser';
import { IRoomRepository } from '../../../src/repositories/IRoomRepository';
import { IReservationRepository } from '../../../src/repositories/IReservationRepository';
import { IUserRepository } from '../../../src/repositories/IUserRepository';
import { Room, RoomType, RoomStatus } from '../../../src/entities/Room';
import { Reservation, ReservationStatus } from '../../../src/entities/Reservation';
import { User, UserRole } from '../../../src/entities/User';
import { Email } from '../../../src/value-objects/Email';
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
}

class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    return this.users.find(u => u.email.equals(email)) || null;
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }
}

describe('CancelReservation Use Case', () => {
  let roomRepository: MockRoomRepository;
  let reservationRepository: MockReservationRepository;
  let userRepository: MockUserRepository;
  let createReservation: CreateReservation;
  let cancelReservation: CancelReservation;
  let createRoom: CreateRoom;
  let registerUser: RegisterUser;

  beforeEach(() => {
    roomRepository = new MockRoomRepository();
    reservationRepository = new MockReservationRepository();
    userRepository = new MockUserRepository();
    createReservation = new CreateReservation(roomRepository, reservationRepository, userRepository);
    cancelReservation = new CancelReservation(reservationRepository, userRepository);
    createRoom = new CreateRoom(roomRepository);
    registerUser = new RegisterUser(userRepository);
  });

  it('should cancel a reservation successfully', async () => {
    const { user } = await registerUser.execute({
      email: 'guest@example.com',
      password: 'Pass123',
      name: 'Guest User',
      phone: '+123',
      documentId: '123',
      role: UserRole.GUEST
    });

    const room = await createRoom.execute({
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: []
    });

    const reservation = await createReservation.execute({
      userId: user.id,
      roomId: room.id,
      checkInDate: new Date('2024-06-01'),
      checkOutDate: new Date('2024-06-05'),
      numberOfGuests: 1
    });

    const cancelled = await cancelReservation.execute({
      reservationId: reservation.id,
      userId: user.id
    });

    expect(cancelled.status).toBe(ReservationStatus.CANCELLED);
  });

  it('should throw error if reservation does not exist', async () => {
    const { user } = await registerUser.execute({
      email: 'guest@example.com',
      password: 'Pass123',
      name: 'Guest User',
      phone: '+123',
      documentId: '123',
      role: UserRole.GUEST
    });

    await expect(cancelReservation.execute({
      reservationId: 'non-existent',
      userId: user.id
    })).rejects.toThrow('Reservation not found');
  });

  it('should throw error if user does not have permission', async () => {
    const { user: user1 } = await registerUser.execute({
      email: 'guest1@example.com',
      password: 'Pass123',
      name: 'Guest 1',
      phone: '+123',
      documentId: '123',
      role: UserRole.GUEST
    });

    const { user: user2 } = await registerUser.execute({
      email: 'guest2@example.com',
      password: 'Pass123',
      name: 'Guest 2',
      phone: '+456',
      documentId: '456',
      role: UserRole.GUEST
    });

    const room = await createRoom.execute({
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: []
    });

    const reservation = await createReservation.execute({
      userId: user1.id,
      roomId: room.id,
      checkInDate: new Date('2024-06-01'),
      checkOutDate: new Date('2024-06-05'),
      numberOfGuests: 1
    });

    await expect(cancelReservation.execute({
      reservationId: reservation.id,
      userId: user2.id
    })).rejects.toThrow('User does not have permission to cancel this reservation');
  });

  it('should allow admin to cancel any reservation', async () => {
    const { user: guest } = await registerUser.execute({
      email: 'guest@example.com',
      password: 'Pass123',
      name: 'Guest User',
      phone: '+123',
      documentId: '123',
      role: UserRole.GUEST
    });

    const { user: admin } = await registerUser.execute({
      email: 'admin@example.com',
      password: 'Pass123',
      name: 'Admin User',
      phone: '+456',
      documentId: '456',
      role: UserRole.ADMIN
    });

    const room = await createRoom.execute({
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: []
    });

    const reservation = await createReservation.execute({
      userId: guest.id,
      roomId: room.id,
      checkInDate: new Date('2024-06-01'),
      checkOutDate: new Date('2024-06-05'),
      numberOfGuests: 1
    });

    const cancelled = await cancelReservation.execute({
      reservationId: reservation.id,
      userId: admin.id
    });

    expect(cancelled.status).toBe(ReservationStatus.CANCELLED);
  });

  it('should allow receptionist to cancel any reservation', async () => {
    const { user: guest } = await registerUser.execute({
      email: 'guest@example.com',
      password: 'Pass123',
      name: 'Guest User',
      phone: '+123',
      documentId: '123',
      role: UserRole.GUEST
    });

    const { user: receptionist } = await registerUser.execute({
      email: 'receptionist@example.com',
      password: 'Pass123',
      name: 'Receptionist User',
      phone: '+456',
      documentId: '456',
      role: UserRole.RECEPTIONIST
    });

    const room = await createRoom.execute({
      number: '101',
      type: RoomType.SINGLE,
      pricePerNight: 100,
      currency: 'USD',
      capacity: 1,
      amenities: []
    });

    const reservation = await createReservation.execute({
      userId: guest.id,
      roomId: room.id,
      checkInDate: new Date('2024-06-01'),
      checkOutDate: new Date('2024-06-05'),
      numberOfGuests: 1
    });

    const cancelled = await cancelReservation.execute({
      reservationId: reservation.id,
      userId: receptionist.id
    });

    expect(cancelled.status).toBe(ReservationStatus.CANCELLED);
  });
});