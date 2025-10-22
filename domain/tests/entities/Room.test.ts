import { Room, RoomType, RoomStatus } from '../../src/entities/Room';
import { Money } from '../../src/value-objects/Money';

describe('Room Entity', () => {
  describe('constructor', () => {
    it('should create a valid room', () => {
      const price = new Money(100, 'USD');
      const room = new Room(
        '1',
        '101',
        RoomType.SINGLE,
        price,
        1,
        ['WiFi', 'TV']
      );

      expect(room.id).toBe('1');
      expect(room.number).toBe('101');
      expect(room.type).toBe(RoomType.SINGLE);
      expect(room.status).toBe(RoomStatus.AVAILABLE);
      expect(room.capacity).toBe(1);
    });

    it('should throw error for empty room number', () => {
      const price = new Money(100, 'USD');
      expect(() => new Room('1', '', RoomType.SINGLE, price, 1, []))
        .toThrow('Room number cannot be empty');
    });

    it('should throw error for invalid capacity', () => {
      const price = new Money(100, 'USD');
      expect(() => new Room('1', '101', RoomType.SINGLE, price, 0, []))
        .toThrow('Capacity must be at least 1');
    });

    it('should throw error for negative capacity', () => {
      const price = new Money(100, 'USD');
      expect(() => new Room('1', '101', RoomType.SINGLE, price, -1, []))
        .toThrow('Capacity must be at least 1');
    });
  });

  describe('isAvailable', () => {
    it('should return true for available room', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      expect(room.isAvailable()).toBe(true);
    });

    it('should return false for occupied room', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      room.markAsOccupied();
      expect(room.isAvailable()).toBe(false);
    });

    it('should return false for room in maintenance', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      room.markAsInMaintenance();
      expect(room.isAvailable()).toBe(false);
    });
  });

  describe('status transitions', () => {
    it('should mark room as occupied', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      room.markAsOccupied();
      expect(room.status).toBe(RoomStatus.OCCUPIED);
    });

    it('should mark room as in maintenance', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      room.markAsInMaintenance();
      expect(room.status).toBe(RoomStatus.MAINTENANCE);
    });

    it('should mark room as reserved', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      room.markAsReserved();
      expect(room.status).toBe(RoomStatus.RESERVED);
    });

    it('should mark room as available', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      room.markAsOccupied();
      room.markAsAvailable();
      expect(room.status).toBe(RoomStatus.AVAILABLE);
    });
  });

  describe('updatePrice', () => {
    it('should update room price', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      
      const newPrice = new Money(150, 'USD');
      room.updatePrice(newPrice);
      
      expect(room.pricePerNight.amount).toBe(150);
    });
  });

  describe('updateAmenities', () => {
    it('should update room amenities', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, ['WiFi']);
      
      room.updateAmenities(['WiFi', 'TV', 'MiniBar']);
      
      expect(room.amenities).toEqual(['WiFi', 'TV', 'MiniBar']);
    });

    it('should remove duplicate amenities', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      
      room.updateAmenities(['WiFi', 'TV', 'WiFi', 'TV']);
      
      expect(room.amenities.length).toBe(2);
      expect(room.amenities).toContain('WiFi');
      expect(room.amenities).toContain('TV');
    });
  });

  describe('canAccommodate', () => {
    it('should return true if guests fit capacity', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.DOUBLE, price, 2, []);
      expect(room.canAccommodate(2)).toBe(true);
    });

    it('should return false if guests exceed capacity', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SINGLE, price, 1, []);
      expect(room.canAccommodate(2)).toBe(false);
    });

    it('should return true for fewer guests than capacity', () => {
      const price = new Money(100, 'USD');
      const room = new Room('1', '101', RoomType.SUITE, price, 4, []);
      expect(room.canAccommodate(2)).toBe(true);
    });
  });
});