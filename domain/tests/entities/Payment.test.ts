import { Payment, PaymentStatus, PaymentMethod } from '../../src/entities/Payment';
import { Money } from '../../src/value-objects/Money';

describe('Payment Entity', () => {
  describe('constructor', () => {
    it('should create a valid payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment(
        '1',
        'reservation-1',
        amount,
        PaymentMethod.CREDIT_CARD
      );

      expect(payment.id).toBe('1');
      expect(payment.reservationId).toBe('reservation-1');
      expect(payment.amount.amount).toBe(400);
      expect(payment.method).toBe(PaymentMethod.CREDIT_CARD);
      expect(payment.status).toBe(PaymentStatus.PENDING);
    });
  });

  describe('complete', () => {
    it('should complete a pending payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);

      payment.complete('txn-12345');

      expect(payment.status).toBe(PaymentStatus.COMPLETED);
      expect(payment.transactionId).toBe('txn-12345');
    });

    it('should throw error when completing non-pending payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);
      
      payment.complete('txn-12345');

      expect(() => payment.complete('txn-67890'))
        .toThrow('Only pending payments can be completed');
    });

    it('should throw error for empty transaction ID', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);

      expect(() => payment.complete(''))
        .toThrow('Transaction ID cannot be empty');
    });
  });

  describe('fail', () => {
    it('should mark payment as failed', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);

      payment.fail('Insufficient funds');

      expect(payment.status).toBe(PaymentStatus.FAILED);
      expect(payment.failureReason).toBe('Insufficient funds');
    });

    it('should throw error when failing non-pending payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);
      
      payment.complete('txn-12345');

      expect(() => payment.fail('Some reason'))
        .toThrow('Only pending payments can be marked as failed');
    });

    it('should throw error for empty failure reason', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);

      expect(() => payment.fail(''))
        .toThrow('Failure reason cannot be empty');
    });
  });

  describe('refund', () => {
    it('should refund a completed payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);
      
      payment.complete('txn-12345');
      payment.refund('Customer request');

      expect(payment.status).toBe(PaymentStatus.REFUNDED);
      expect(payment.refundReason).toBe('Customer request');
    });

    it('should throw error when refunding non-completed payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);

      expect(() => payment.refund('Some reason'))
        .toThrow('Only completed payments can be refunded');
    });

    it('should throw error for empty refund reason', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);
      payment.complete('txn-12345');

      expect(() => payment.refund(''))
        .toThrow('Refund reason cannot be empty');
    });
  });

  describe('isPending', () => {
    it('should return true for pending payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);

      expect(payment.isPending()).toBe(true);
    });

    it('should return false for completed payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);
      payment.complete('txn-12345');

      expect(payment.isPending()).toBe(false);
    });
  });

  describe('isCompleted', () => {
    it('should return true for completed payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);
      payment.complete('txn-12345');

      expect(payment.isCompleted()).toBe(true);
    });

    it('should return false for pending payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);

      expect(payment.isCompleted()).toBe(false);
    });
  });

  describe('isRefunded', () => {
    it('should return true for refunded payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);
      payment.complete('txn-12345');
      payment.refund('Customer request');

      expect(payment.isRefunded()).toBe(true);
    });

    it('should return false for completed payment', () => {
      const amount = new Money(400, 'USD');
      const payment = new Payment('1', 'res-1', amount, PaymentMethod.CREDIT_CARD);
      payment.complete('txn-12345');

      expect(payment.isRefunded()).toBe(false);
    });
  });
});