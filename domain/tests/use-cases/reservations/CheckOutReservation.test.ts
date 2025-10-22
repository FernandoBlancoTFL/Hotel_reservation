import { CreateReservation } from '../../../src/use-cases/reservations/CreateReservation';
import { CheckInReservation } from '../../../src/use-cases/reservations/CheckInReservation';
import { CheckOutReservation } from '../../../src/use-cases/reservations/CheckOutReservation';
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

describe('CheckOutReservation Use Case', () => {
  let roomRepository: MockRoomRepository;
  let reservationRepository: MockReservationRepository;
  let userRepository: MockUserRepository;
  let createReservation: CreateReservation;
  let checkInReservation: CheckInReservation;
  let checkOutReservation: CheckOutReservation;
  let createRoom: CreateRoom;
  let registerUser: RegisterUser;

  beforeEach(() => {
    roomRepository = new MockRoomRepository();
    reservationRepository = new MockReservationRepository();
    userRepository = new MockUserRepository();
    createReservation = new CreateReservation(roomRepository, reservationRepository, userRepository);
    checkInReservation = new CheckInReservation(reservationRepository, roomRepository, userRepository);
    checkOutReservation = new CheckOutReservation(reservationRepository, roomRepository, userRepository);
    createRoom = new CreateRoom(roomRepository);
    registerUser = new RegisterUser(userRepository);
  });

  it('should check out a checked-in reservation', async () => {
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
      name: 'Receptionist',
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

    // Confirm and check in
    reservation.confirm();
    await reservationRepository.update(reservation);
    await checkInReservation.execute({
      reservationId: reservation.id,
      userId: receptionist.id
    });

    // Check out
    const checkedOut = await checkOutReservation.execute({
      reservationId: reservation.id,
      userId: receptionist.id
    });

    expect(checkedOut.status).toBe(ReservationStatus.CHECKED_OUT);
    
    // Verify room is available again
    const updatedRoom = await roomRepository.findById(room.id);
    expect(updatedRoom?.status).toBe(RoomStatus.AVAILABLE);
  });

  it('should throw error if reservation not found', async () => {
    const { user: receptionist } = await registerUser.execute({
      email: 'receptionist@example.com',
      password: 'Pass123',
      name: 'Receptionist',
      phone: '+456',
      documentId: '456',
      role: UserRole.RECEPTIONIST
    });

    await expect(checkOutReservation.execute({
      reservationId: 'non-existent',
      userId: receptionist.id
    })).rejects.toThrow('Reservation not found');
  });

  it('should throw error if user does not have permission', async () => {
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
      name: 'Receptionist',
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

    reservation.confirm();
    await reservationRepository.update(reservation);
    await checkInReservation.execute({
      reservationId: reservation.id,
      userId: receptionist.id
    });

    await expect(checkOutReservation.execute({
      reservationId: reservation.id,
      userId: guest.id
    })).rejects.toThrow('User does not have permission to check out reservations');
  });
});