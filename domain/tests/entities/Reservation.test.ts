import { Reservation, ReservationStatus } from '../../src/entities/Reservation';
import { DateRange } from '../../src/value-objects/DateRange';
import { Money } from '../../src/value-objects/Money';

describe('Reservation Entity', () => {
  describe('constructor', () => {
    it('should create a valid reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');

      const reservation = new Reservation(
        '1',
        'user-1',
        'room-1',
        dateRange,
        2,
        totalPrice
      );

      expect(reservation.id).toBe('1');
      expect(reservation.userId).toBe('user-1');
      expect(reservation.roomId).toBe('room-1');
      expect(reservation.numberOfGuests).toBe(2);
      expect(reservation.status).toBe(ReservationStatus.PENDING);
    });

    it('should throw error for invalid number of guests', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');

      expect(() => new Reservation('1', 'user-1', 'room-1', dateRange, 0, totalPrice))
        .toThrow('Number of guests must be at least 1');
    });

    it('should throw error for negative number of guests', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');

      expect(() => new Reservation('1', 'user-1', 'room-1', dateRange, -1, totalPrice))
        .toThrow('Number of guests must be at least 1');
    });
  });

  describe('confirm', () => {
    it('should confirm a pending reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);

      reservation.confirm();

      expect(reservation.status).toBe(ReservationStatus.CONFIRMED);
    });

    it('should throw error when confirming non-pending reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      
      reservation.confirm();

      expect(() => reservation.confirm()).toThrow('Only pending reservations can be confirmed');
    });
  });

  describe('cancel', () => {
    it('should cancel a pending reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);

      reservation.cancel();

      expect(reservation.status).toBe(ReservationStatus.CANCELLED);
    });

    it('should cancel a confirmed reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      
      reservation.confirm();
      reservation.cancel();

      expect(reservation.status).toBe(ReservationStatus.CANCELLED);
    });

    it('should throw error when canceling checked-in reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      
      reservation.confirm();
      reservation.checkIn();

      expect(() => reservation.cancel()).toThrow('Cannot cancel a reservation that is already checked in');
    });

    it('should throw error when canceling checked-out reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      
      reservation.confirm();
      reservation.checkIn();
      reservation.checkOut();

      expect(() => reservation.cancel()).toThrow('Cannot cancel a reservation that is already checked in');
    });
  });

  describe('checkIn', () => {
    it('should check in a confirmed reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      
      reservation.confirm();
      reservation.checkIn();

      expect(reservation.status).toBe(ReservationStatus.CHECKED_IN);
    });

    it('should throw error when checking in non-confirmed reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);

      expect(() => reservation.checkIn()).toThrow('Only confirmed reservations can be checked in');
    });
  });

  describe('checkOut', () => {
    it('should check out a checked-in reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      
      reservation.confirm();
      reservation.checkIn();
      reservation.checkOut();

      expect(reservation.status).toBe(ReservationStatus.CHECKED_OUT);
    });

    it('should throw error when checking out non-checked-in reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      
      reservation.confirm();

      expect(() => reservation.checkOut()).toThrow('Only checked-in reservations can be checked out');
    });
  });

  describe('isPending', () => {
    it('should return true for pending reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);

      expect(reservation.isPending()).toBe(true);
    });

    it('should return false for confirmed reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      reservation.confirm();

      expect(reservation.isPending()).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true for confirmed reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      reservation.confirm();

      expect(reservation.isActive()).toBe(true);
    });

    it('should return true for checked-in reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      reservation.confirm();
      reservation.checkIn();

      expect(reservation.isActive()).toBe(true);
    });

    it('should return false for cancelled reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      reservation.cancel();

      expect(reservation.isActive()).toBe(false);
    });

    it('should return false for checked-out reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      reservation.confirm();
      reservation.checkIn();
      reservation.checkOut();

      expect(reservation.isActive()).toBe(false);
    });
  });

  describe('updateDates', () => {
    it('should update dates for pending reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);

      const newDateRange = new DateRange(
        new Date('2024-02-01'),
        new Date('2024-02-05')
      );
      const newTotalPrice = new Money(500, 'USD');

      reservation.updateDates(newDateRange, newTotalPrice);

      expect(reservation.dateRange.startDate).toEqual(new Date('2024-02-01'));
      expect(reservation.totalPrice.amount).toBe(500);
    });

    it('should throw error when updating dates for non-pending reservation', () => {
      const dateRange = new DateRange(
        new Date('2024-01-01'),
        new Date('2024-01-05')
      );
      const totalPrice = new Money(400, 'USD');
      const reservation = new Reservation('1', 'user-1', 'room-1', dateRange, 2, totalPrice);
      reservation.confirm();

      const newDateRange = new DateRange(
        new Date('2024-02-01'),
        new Date('2024-02-05')
      );
      const newTotalPrice = new Money(500, 'USD');

      expect(() => reservation.updateDates(newDateRange, newTotalPrice))
        .toThrow('Only pending reservations can be modified');
    });
  });
});