export class DateRange {
  private readonly _startDate: Date;
  private readonly _endDate: Date;

  constructor(startDate: Date, endDate: Date) {
    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    this._startDate = new Date(startDate);
    this._endDate = new Date(endDate);
  }

  get startDate(): Date {
    return new Date(this._startDate);
  }

  get endDate(): Date {
    return new Date(this._endDate);
  }

  numberOfNights(): number {
    const diffTime = this._endDate.getTime() - this._startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  overlaps(other: DateRange): boolean {
    return this._startDate < other._endDate && this._endDate > other._startDate;
  }

  contains(date: Date): boolean {
    return date >= this._startDate && date < this._endDate;
  }

  equals(other: DateRange): boolean {
    return this._startDate.getTime() === other._startDate.getTime() &&
           this._endDate.getTime() === other._endDate.getTime();
  }

  toString(): string {
    return `${this._startDate.toISOString().split('T')[0]} to ${this._endDate.toISOString().split('T')[0]}`;
  }
}
