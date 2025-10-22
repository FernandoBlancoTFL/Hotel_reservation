import { Money } from '../../src/value-objects/Money';

describe('Money Value Object', () => {
  describe('constructor', () => {
    it('should create money with valid amount', () => {
      const money = new Money(100, 'USD');
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('USD');
    });

    it('should throw error for negative amount', () => {
      expect(() => new Money(-10, 'USD')).toThrow('Amount cannot be negative');
    });

    it('should throw error for invalid currency', () => {
      expect(() => new Money(100, '')).toThrow('Currency cannot be empty');
    });

    it('should round to 2 decimal places', () => {
      const money = new Money(100.999, 'USD');
      expect(money.amount).toBe(101);
    });
  });

  describe('add', () => {
    it('should add two money objects with same currency', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'USD');
      const result = money1.add(money2);
      expect(result.amount).toBe(150);
    });

    it('should throw error when adding different currencies', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'EUR');
      expect(() => money1.add(money2)).toThrow('Cannot add different currencies');
    });
  });

  describe('subtract', () => {
    it('should subtract two money objects', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(30, 'USD');
      const result = money1.subtract(money2);
      expect(result.amount).toBe(70);
    });

    it('should throw error when result is negative', () => {
      const money1 = new Money(50, 'USD');
      const money2 = new Money(100, 'USD');
      expect(() => money1.subtract(money2)).toThrow('Result cannot be negative');
    });
  });

  describe('multiply', () => {
    it('should multiply money by a factor', () => {
      const money = new Money(50, 'USD');
      const result = money.multiply(3);
      expect(result.amount).toBe(150);
    });

    it('should throw error for negative multiplier', () => {
      const money = new Money(50, 'USD');
      expect(() => money.multiply(-2)).toThrow('Multiplier cannot be negative');
    });
  });

  describe('equals', () => {
    it('should return true for same amount and currency', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'USD');
      expect(money1.equals(money2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'USD');
      expect(money1.equals(money2)).toBe(false);
    });

    it('should return false for different currencies', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'EUR');
      expect(money1.equals(money2)).toBe(false);
    });
  });

  describe('isGreaterThan', () => {
    it('should return true when amount is greater', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'USD');
      expect(money1.isGreaterThan(money2)).toBe(true);
    });

    it('should throw error when comparing different currencies', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(50, 'EUR');
      expect(() => money1.isGreaterThan(money2)).toThrow('Cannot compare different currencies');
    });
  });
});