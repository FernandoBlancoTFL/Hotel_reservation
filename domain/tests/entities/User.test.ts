import { User, UserRole } from '../../src/entities/User';
import { Email } from '../../src/value-objects/Email';

describe('User Entity', () => {
  describe('constructor', () => {
    it('should create a valid user', () => {
      const email = new Email('john@example.com');
      const user = new User(
        '123',
        email,
        'hashedPassword123',
        'John Doe',
        '+1234567890',
        '12345678',
        UserRole.GUEST
      );

      expect(user.id).toBe('123');
      expect(user.email.value).toBe('john@example.com');
      expect(user.name).toBe('John Doe');
      expect(user.role).toBe(UserRole.GUEST);
    });

    it('should throw error for empty name', () => {
      const email = new Email('john@example.com');
      expect(() => new User('123', email, 'hash', '', '+123', '123', UserRole.GUEST))
        .toThrow('Name cannot be empty');
    });

    it('should throw error for empty password hash', () => {
      const email = new Email('john@example.com');
      expect(() => new User('123', email, '', 'John', '+123', '123', UserRole.GUEST))
        .toThrow('Password hash cannot be empty');
    });
  });

  describe('hasRole', () => {
    it('should return true for matching role', () => {
      const email = new Email('admin@example.com');
      const user = new User('1', email, 'hash', 'Admin', '+123', '123', UserRole.ADMIN);
      expect(user.hasRole(UserRole.ADMIN)).toBe(true);
    });

    it('should return false for non-matching role', () => {
      const email = new Email('guest@example.com');
      const user = new User('1', email, 'hash', 'Guest', '+123', '123', UserRole.GUEST);
      expect(user.hasRole(UserRole.ADMIN)).toBe(false);
    });
  });

  describe('can', () => {
    it('admin should have all permissions', () => {
      const email = new Email('admin@example.com');
      const admin = new User('1', email, 'hash', 'Admin', '+123', '123', UserRole.ADMIN);
      
      expect(admin.can('CREATE_ROOM')).toBe(true);
      expect(admin.can('DELETE_ROOM')).toBe(true);
      expect(admin.can('MANAGE_USERS')).toBe(true);
      expect(admin.can('CREATE_RESERVATION')).toBe(true);
    });

    it('receptionist should have limited permissions', () => {
      const email = new Email('recep@example.com');
      const receptionist = new User('1', email, 'hash', 'Recep', '+123', '123', UserRole.RECEPTIONIST);
      
      expect(receptionist.can('CREATE_ROOM')).toBe(true);
      expect(receptionist.can('UPDATE_ROOM')).toBe(true);
      expect(receptionist.can('CREATE_RESERVATION')).toBe(true);
      expect(receptionist.can('CHECK_IN')).toBe(true);
      expect(receptionist.can('DELETE_ROOM')).toBe(false);
      expect(receptionist.can('MANAGE_USERS')).toBe(false);
    });

    it('guest should have minimal permissions', () => {
      const email = new Email('guest@example.com');
      const guest = new User('1', email, 'hash', 'Guest', '+123', '123', UserRole.GUEST);
      
      expect(guest.can('CREATE_RESERVATION')).toBe(true);
      expect(guest.can('CANCEL_OWN_RESERVATION')).toBe(true);
      expect(guest.can('VIEW_OWN_RESERVATIONS')).toBe(true);
      expect(guest.can('CREATE_ROOM')).toBe(false);
      expect(guest.can('CHECK_IN')).toBe(false);
    });
  });

  describe('updateProfile', () => {
    it('should update name and phone', () => {
      const email = new Email('john@example.com');
      const user = new User('1', email, 'hash', 'John', '+123', '123', UserRole.GUEST);
      
      user.updateProfile('John Updated', '+9999999');
      
      expect(user.name).toBe('John Updated');
      expect(user.phone).toBe('+9999999');
    });

    it('should throw error for empty name', () => {
      const email = new Email('john@example.com');
      const user = new User('1', email, 'hash', 'John', '+123', '123', UserRole.GUEST);
      
      expect(() => user.updateProfile('', '+999')).toThrow('Name cannot be empty');
    });
  });

  describe('changePassword', () => {
    it('should update password hash', () => {
      const email = new Email('john@example.com');
      const user = new User('1', email, 'oldHash', 'John', '+123', '123', UserRole.GUEST);
      
      user.changePassword('newHash');
      
      expect(user.passwordHash).toBe('newHash');
    });

    it('should throw error for empty hash', () => {
      const email = new Email('john@example.com');
      const user = new User('1', email, 'oldHash', 'John', '+123', '123', UserRole.GUEST);
      
      expect(() => user.changePassword('')).toThrow('Password hash cannot be empty');
    });
  });
});