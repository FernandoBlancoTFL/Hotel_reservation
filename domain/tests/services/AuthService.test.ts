import { AuthService } from '../../src/services/AuthService';
import { User, UserRole } from '../../src/entities/User';
import { Email } from '../../src/value-objects/Email';

describe('AuthService', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'mySecurePassword123';
      const hash = await AuthService.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'mySecurePassword123';
      const hash1 = await AuthService.hashPassword(password);
      const hash2 = await AuthService.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'mySecurePassword123';
      const hash = await AuthService.hashPassword(password);

      const isValid = await AuthService.verifyPassword(password, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'mySecurePassword123';
      const hash = await AuthService.hashPassword(password);

      const isValid = await AuthService.verifyPassword('wrongPassword', hash);

      expect(isValid).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a token for user', () => {
      const email = new Email('user@example.com');
      const user = new User('1', email, 'hash', 'User', '+123', '123', UserRole.GUEST);

      const token = AuthService.generateToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for different users', () => {
      const email1 = new Email('user1@example.com');
      const user1 = new User('1', email1, 'hash', 'User1', '+123', '123', UserRole.GUEST);

      const email2 = new Email('user2@example.com');
      const user2 = new User('2', email2, 'hash', 'User2', '+456', '456', UserRole.GUEST);

      const token1 = AuthService.generateToken(user1);
      const token2 = AuthService.generateToken(user2);

      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode valid token', () => {
      const email = new Email('user@example.com');
      const user = new User('1', email, 'hash', 'User', '+123', '123', UserRole.GUEST);

      const token = AuthService.generateToken(user);
      const payload = AuthService.verifyToken(token);

      expect(payload).toBeDefined();
      expect(payload.userId).toBe('1');
      expect(payload.email).toBe('user@example.com');
      expect(payload.role).toBe(UserRole.GUEST);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => AuthService.verifyToken(invalidToken)).toThrow();
    });

    it('should throw error for tampered token', () => {
      const email = new Email('user@example.com');
      const user = new User('1', email, 'hash', 'User', '+123', '123', UserRole.GUEST);

      const token = AuthService.generateToken(user);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      expect(() => AuthService.verifyToken(tamperedToken)).toThrow();
    });
  });
});