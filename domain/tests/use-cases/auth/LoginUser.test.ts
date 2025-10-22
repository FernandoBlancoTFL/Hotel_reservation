import { LoginUser } from '../../../src/use-cases/auth/LoginUser';
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

describe('LoginUser Use Case', () => {
  let userRepository: MockUserRepository;
  let registerUser: RegisterUser;
  let loginUser: LoginUser;

  beforeEach(() => {
    userRepository = new MockUserRepository();
    registerUser = new RegisterUser(userRepository);
    loginUser = new LoginUser(userRepository);
  });

  it('should login user with correct credentials', async () => {
    // First register a user
    await registerUser.execute({
      email: 'john@example.com',
      password: 'SecurePass123',
      name: 'John Doe',
      phone: '+1234567890',
      documentId: '12345678',
      role: UserRole.GUEST
    });

    // Then login
    const result = await loginUser.execute({
      email: 'john@example.com',
      password: 'SecurePass123'
    });

    expect(result.user.email.value).toBe('john@example.com');
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
  });

  it('should throw error for non-existent user', async () => {
    await expect(loginUser.execute({
      email: 'nonexistent@example.com',
      password: 'SomePassword'
    })).rejects.toThrow('Invalid email or password');
  });

  it('should throw error for incorrect password', async () => {
    await registerUser.execute({
      email: 'john@example.com',
      password: 'SecurePass123',
      name: 'John Doe',
      phone: '+1234567890',
      documentId: '12345678',
      role: UserRole.GUEST
    });

    await expect(loginUser.execute({
      email: 'john@example.com',
      password: 'WrongPassword'
    })).rejects.toThrow('Invalid email or password');
  });

  it('should throw error for invalid email format', async () => {
    await expect(loginUser.execute({
      email: 'invalid-email',
      password: 'SomePassword'
    })).rejects.toThrow('Invalid email format');
  });

  it('should be case insensitive for email', async () => {
    await registerUser.execute({
      email: 'John@Example.com',
      password: 'SecurePass123',
      name: 'John Doe',
      phone: '+1234567890',
      documentId: '12345678',
      role: UserRole.GUEST
    });

    const result = await loginUser.execute({
      email: 'john@example.com',
      password: 'SecurePass123'
    });

    expect(result.user.email.value).toBe('john@example.com');
  });
});