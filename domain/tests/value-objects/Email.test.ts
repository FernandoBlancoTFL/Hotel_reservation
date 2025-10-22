import { Email } from '../../src/value-objects/Email';

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create a valid email', () => {
      const email = new Email('test@example.com');
      expect(email.value).toBe('test@example.com');
    });

    it('should throw error for invalid email format', () => {
      expect(() => new Email('invalid-email')).toThrow('Invalid email format');
    });

    it('should throw error for empty email', () => {
      expect(() => new Email('')).toThrow('Email cannot be empty');
    });

    it('should normalize email to lowercase', () => {
      const email = new Email('TEST@EXAMPLE.COM');
      expect(email.value).toBe('test@example.com');
    });
  });

  describe('equals', () => {
    it('should return true for same email', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });
  });
});