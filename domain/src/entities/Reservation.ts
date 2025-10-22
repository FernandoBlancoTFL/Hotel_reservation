import { DateRange } from '../value-objects/DateRange';
import { Money } from '../value-objects/Money';

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED'
}

export class Reservation {
  private _id: string;
  private _userId: string;
  private _roomId: string;
  private _dateRange: DateRange;
  private _numberOfGuests: number;
  private _totalPrice: Money;
  private _status: ReservationStatus;
  private _createdAt: Date;

  constructor(
    id: string,
    userId: string,
    roomId: string,
    dateRange: DateRange,
    numberOfGuests: number,
    totalPrice: Money
  ) {
    if (numberOfGuests < 1) {
      throw new Error('Number of guests must be at least 1');
    }

    this._id = id;
    this._userId = userId;
    this._roomId = roomId;
    this._dateRange = dateRange;
    this._numberOfGuests = numberOfGuests;
    this._totalPrice = totalPrice;
    this._status = ReservationStatus.PENDING;
    this._createdAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get roomId(): string {
    return this._roomId;
  }

  get dateRange(): DateRange {
    return this._dateRange;
  }

  get numberOfGuests(): number {
    return this._numberOfGuests;
  }

  get totalPrice(): Money {
    return this._totalPrice;
  }

  get status(): ReservationStatus {
    return this._status;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  confirm(): void {
    if (this._status !== ReservationStatus.PENDING) {
      throw new Error('Only pending reservations can be confirmed');
    }
    this._status = ReservationStatus.CONFIRMED;
  }

  cancel(): void {
    if (this._status === ReservationStatus.CHECKED_IN || 
        this._status === ReservationStatus.CHECKED_OUT) {
      throw new Error('Cannot cancel a reservation that is already checked in');
    }
    this._status = ReservationStatus.CANCELLED;
  }

  checkIn(): void {
    if (this._status !== ReservationStatus.CONFIRMED) {
      throw new Error('Only confirmed reservations can be checked in');
    }
    this._status = ReservationStatus.CHECKED_IN;
  }

  checkOut(): void {
    if (this._status !== ReservationStatus.CHECKED_IN) {
      throw new Error('Only checked-in reservations can be checked out');
    }
    this._status = ReservationStatus.CHECKED_OUT;
  }

  isPending(): boolean {
    return this._status === ReservationStatus.PENDING;
  }

  isActive(): boolean {
    return this._status === ReservationStatus.PENDING ||
            this._status === ReservationStatus.CONFIRMED ||
            this._status === ReservationStatus.CHECKED_IN;
    }

  updateDates(newDateRange: DateRange, newTotalPrice: Money): void {
    if (this._status !== ReservationStatus.PENDING) {
      throw new Error('Only pending reservations can be modified');
    }
    this._dateRange = newDateRange;
    this._totalPrice = newTotalPrice;
  }
}