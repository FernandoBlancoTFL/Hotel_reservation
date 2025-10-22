import { DateRange } from '../../src/value-objects/DateRange';

describe('DateRange Value Object', () => {
  describe('constructor', () => {
    it('should create a valid date range', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-05');
      const dateRange = new DateRange(start, end);
      expect(dateRange.startDate).toEqual(start);
      expect(dateRange.endDate).toEqual(end);
    });

    it('should throw error when end date is before start date', () => {
      const start = new Date('2024-01-05');
      const end = new Date('2024-01-01');
      expect(() => new DateRange(start, end)).toThrow('End date must be after start date');
    });

    it('should throw error when start and end are the same', () => {
      const date = new Date('2024-01-01');
      expect(() => new DateRange(date, date)).toThrow('End date must be after start date');
    });
  });

  describe('numberOfNights', () => {
    it('should calculate correct number of nights', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-05');
      const dateRange = new DateRange(start, end);
      expect(dateRange.numberOfNights()).toBe(4);
    });

    it('should return 1 for consecutive days', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-02');
      const dateRange = new DateRange(start, end);
      expect(dateRange.numberOfNights()).toBe(1);
    });
  });

  describe('overlaps', () => {
    it('should return true for overlapping ranges', () => {
      const range1 = new DateRange(new Date('2024-01-01'), new Date('2024-01-05'));
      const range2 = new DateRange(new Date('2024-01-03'), new Date('2024-01-07'));
      expect(range1.overlaps(range2)).toBe(true);
    });

    it('should return false for non-overlapping ranges', () => {
      const range1 = new DateRange(new Date('2024-01-01'), new Date('2024-01-05'));
      const range2 = new DateRange(new Date('2024-01-06'), new Date('2024-01-10'));
      expect(range1.overlaps(range2)).toBe(false);
    });

    it('should return false when ranges are adjacent', () => {
      const range1 = new DateRange(new Date('2024-01-01'), new Date('2024-01-05'));
      const range2 = new DateRange(new Date('2024-01-05'), new Date('2024-01-10'));
      expect(range1.overlaps(range2)).toBe(false);
    });

    it('should return true when one range contains another', () => {
      const range1 = new DateRange(new Date('2024-01-01'), new Date('2024-01-10'));
      const range2 = new DateRange(new Date('2024-01-03'), new Date('2024-01-05'));
      expect(range1.overlaps(range2)).toBe(true);
    });
  });

  describe('contains', () => {
    it('should return true for date within range', () => {
      const range = new DateRange(new Date('2024-01-01'), new Date('2024-01-05'));
      const date = new Date('2024-01-03');
      expect(range.contains(date)).toBe(true);
    });

    it('should return false for date outside range', () => {
      const range = new DateRange(new Date('2024-01-01'), new Date('2024-01-05'));
      const date = new Date('2024-01-06');
      expect(range.contains(date)).toBe(false);
    });

    it('should return true for start date', () => {
      const range = new DateRange(new Date('2024-01-01'), new Date('2024-01-05'));
      const date = new Date('2024-01-01');
      expect(range.contains(date)).toBe(true);
    });

    it('should return false for end date', () => {
      const range = new DateRange(new Date('2024-01-01'), new Date('2024-01-05'));
      const date = new Date('2024-01-05');
      expect(range.contains(date)).toBe(false);
    });
  });
});
