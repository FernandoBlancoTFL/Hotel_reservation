import { PricingService } from '../../src/services/PricingService';
import { Money } from '../../src/value-objects/Money';
import { DateRange } from '../../src/value-objects/DateRange';

describe('PricingService', () => {
  describe('calculateTotalPrice', () => {
    it('should calculate total price for date range', () => {
      const pricePerNight = new Money(100, 'USD');
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );

      const total = PricingService.calculateTotalPrice(pricePerNight, dateRange);

      expect(total.amount).toBe(400); // 4 nights * 100
      expect(total.currency).toBe('USD');
    });

    it('should calculate for single night', () => {
      const pricePerNight = new Money(150, 'USD');
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-02')
      );

      const total = PricingService.calculateTotalPrice(pricePerNight, dateRange);

      expect(total.amount).toBe(150);
    });

    it('should handle different currencies', () => {
      const pricePerNight = new Money(80, 'EUR');
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-04')
      );

      const total = PricingService.calculateTotalPrice(pricePerNight, dateRange);

      expect(total.amount).toBe(240);
      expect(total.currency).toBe('EUR');
    });
  });

  describe('applyDiscount', () => {
    it('should apply percentage discount', () => {
      const originalPrice = new Money(100, 'USD');
      const discountPercentage = 10;

      const discountedPrice = PricingService.applyDiscount(originalPrice, discountPercentage);

      expect(discountedPrice.amount).toBe(90);
    });

    it('should apply 50% discount', () => {
      const originalPrice = new Money(200, 'USD');
      const discountPercentage = 50;

      const discountedPrice = PricingService.applyDiscount(originalPrice, discountPercentage);

      expect(discountedPrice.amount).toBe(100);
    });

    it('should throw error for negative discount', () => {
      const originalPrice = new Money(100, 'USD');

      expect(() => PricingService.applyDiscount(originalPrice, -10))
        .toThrow('Discount percentage must be between 0 and 100');
    });

    it('should throw error for discount over 100%', () => {
      const originalPrice = new Money(100, 'USD');

      expect(() => PricingService.applyDiscount(originalPrice, 110))
        .toThrow('Discount percentage must be between 0 and 100');
    });

    it('should return original price for 0% discount', () => {
      const originalPrice = new Money(100, 'USD');

      const discountedPrice = PricingService.applyDiscount(originalPrice, 0);

      expect(discountedPrice.amount).toBe(100);
    });
  });

  describe('calculateRefundAmount', () => {
    it('should calculate full refund for cancellation with enough days in advance', () => {
      const totalPrice = new Money(400, 'USD');
      const daysBeforeCheckIn = 10;

      const refund = PricingService.calculateRefundAmount(totalPrice, daysBeforeCheckIn);

      expect(refund.amount).toBe(400); // 100% refund
    });

    it('should calculate 50% refund for cancellation 3-6 days before', () => {
      const totalPrice = new Money(400, 'USD');
      const daysBeforeCheckIn = 5;

      const refund = PricingService.calculateRefundAmount(totalPrice, daysBeforeCheckIn);

      expect(refund.amount).toBe(200); // 50% refund
    });

    it('should calculate no refund for cancellation less than 3 days before', () => {
      const totalPrice = new Money(400, 'USD');
      const daysBeforeCheckIn = 2;

      const refund = PricingService.calculateRefundAmount(totalPrice, daysBeforeCheckIn);

      expect(refund.amount).toBe(0); // No refund
    });

    it('should throw error for negative days', () => {
      const totalPrice = new Money(400, 'USD');

      expect(() => PricingService.calculateRefundAmount(totalPrice, -1))
        .toThrow('Days before check-in cannot be negative');
    });
  });
});