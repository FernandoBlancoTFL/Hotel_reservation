import { RegisterUser } from '../../../src/use-cases/auth/RegisterUser';
import { IUserRepository } from '../../../src/repositories/IUserRepository';
import { User, UserRole } from '../../../src/entities/User';
import { Email } from '../../../src/value-objects/Email';

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

  reset() {
    this.users = [];
  }
}

describe('RegisterUser Use Case', () => {
  let userRepository: MockUserRepository;
  let registerUser: RegisterUser;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    registerUser = new RegisterUser(userRepository);
  });

  it('should register a new user successfully', async () => {
    const userData = {
      email: 'john@example.com',
      password: 'SecurePass123',
      name: 'John Doe',
      phone: '+1234567890',
      documentId: '12345678',
      role: UserRole.GUEST
    };

    const result = await registerUser.execute(userData);

    expect(result.user.email.value).toBe('john@example.com');
    expect(result.user.name).toBe('John Doe');
    expect(result.user.role).toBe(UserRole.GUEST);
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
  });

  it('should hash the password', async () => {
    const userData = {
      email: 'john@example.com',
      password: 'SecurePass123',
      name: 'John Doe',
      phone: '+1234567890',
      documentId: '12345678',
      role: UserRole.GUEST
    };

    const result = await registerUser.execute(userData);

    expect(result.user.passwordHash).not.toBe('SecurePass123');
    expect(result.user.passwordHash.length).toBeGreaterThan(0);
  });

  it('should throw error if email already exists', async () => {
    const userData = {
      email: 'john@example.com',
      password: 'SecurePass123',
      name: 'John Doe',
      phone: '+1234567890',
      documentId: '12345678',
      role: UserRole.GUEST
    };

    await registerUser.execute(userData);

    await expect(registerUser.execute(userData))
      .rejects.toThrow('User with this email already exists');
  });

  it('should throw error for invalid email', async () => {
    const userData = {
      email: 'invalid-email',
      password: 'SecurePass123',
      name: 'John Doe',
      phone: '+1234567890',
      documentId: '12345678',
      role: UserRole.GUEST
    };

    await expect(registerUser.execute(userData))
      .rejects.toThrow('Invalid email format');
  });

  it('should throw error for weak password', async () => {
    const userData = {
      email: 'john@example.com',
      password: '123',
      name: 'John Doe',
      phone: '+1234567890',
      documentId: '12345678',
      role: UserRole.GUEST
    };

    await expect(registerUser.execute(userData))
      .rejects.toThrow('Password must be at least 6 characters long');
  });

  it('should throw error for empty name', async () => {
    const userData = {
      email: 'john@example.com',
      password: 'SecurePass123',
      name: '',
      phone: '+1234567890',
      documentId: '12345678',
      role: UserRole.GUEST
    };

    await expect(registerUser.execute(userData))
      .rejects.toThrow('Name cannot be empty');
  });
});