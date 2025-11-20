import { IUserRepository } from '@hotel/domain/src/repositories/IUserRepository';
import { User, UserRole } from '@hotel/domain/src/entities/User';
import { Email } from '@hotel/domain/src/value-objects/Email';
import { Pool } from 'pg';

export class PostgresUserRepository implements IUserRepository {
  constructor(private pool: Pool) {}

  async save(user: User): Promise<void> {
    const query = `
      INSERT INTO users (id, email, password_hash, name, phone, document_id, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    
    await this.pool.query(query, [
      user.id,
      user.email.value,
      user.passwordHash,
      user.name,
      user.phone,
      user.documentId,
      user.role
    ]);
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    
    return this.mapToUser(result.rows[0]);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await this.pool.query(query, [email.value]);
    
    if (result.rows.length === 0) return null;
    
    return this.mapToUser(result.rows[0]);
  }

  async update(user: User): Promise<void> {
    const query = `
      UPDATE users 
      SET email = $2, password_hash = $3, name = $4, phone = $5, document_id = $6, role = $7
      WHERE id = $1
    `;
    
    const result = await this.pool.query(query, [
      user.id,
      user.email.value,
      user.passwordHash,
      user.name,
      user.phone,
      user.documentId,
      user.role
    ]);

    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
  }

  async delete(id: string): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1';
    await this.pool.query(query, [id]);
  }

  async findAll(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY name';
    const result = await this.pool.query(query);
    
    return result.rows.map(row => this.mapToUser(row));
  }

  async findByRole(role: UserRole): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE role = $1 ORDER BY name';
    const result = await this.pool.query(query, [role]);
    
    return result.rows.map(row => this.mapToUser(row));
  }

  private mapToUser(row: any): User {
    const email = new Email(row.email);
    
    return new User(
      row.id,
      email,
      row.password_hash,
      row.name,
      row.phone,
      row.document_id,
      row.role as UserRole
    );
  }
}