import { IUserRepository } from '@hotel/domain/src/repositories/IUserRepository';
import { User } from '@hotel/domain/src/entities/User';
import { Email } from '@hotel/domain/src/value-objects/Email';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email.equals(email)) {
        return user;
      }
    }
    return null;
  }

  async update(user: User): Promise<void> {
    if (!this.users.has(user.id)) {
      throw new Error('User not found');
    }
    this.users.set(user.id, user);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}