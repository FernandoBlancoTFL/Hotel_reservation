import { Money } from '../value-objects/Money';

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  SUITE = 'SUITE',
  DELUXE = 'DELUXE'
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

export class Room {
  private _id: string;
  private _number: string;
  private _type: RoomType;
  private _pricePerNight: Money;
  private _capacity: number;
  private _amenities: string[];
  private _status: RoomStatus;
  private _createdAt: Date;

  constructor(
    id: string,
    number: string,
    type: RoomType,
    pricePerNight: Money,
    capacity: number,
    amenities: string[]
  ) {
    if (!number || number.trim() === '') {
      throw new Error('Room number cannot be empty');
    }

    if (capacity < 1) {
      throw new Error('Capacity must be at least 1');
    }

    this._id = id;
    this._number = number.trim();
    this._type = type;
    this._pricePerNight = pricePerNight;
    this._capacity = capacity;
    this._amenities = [...new Set(amenities)]; // Remove duplicates
    this._status = RoomStatus.AVAILABLE;
    this._createdAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get number(): string {
    return this._number;
  }

  get type(): RoomType {
    return this._type;
  }

  get pricePerNight(): Money {
    return this._pricePerNight;
  }

  get capacity(): number {
    return this._capacity;
  }

  get amenities(): string[] {
    return [...this._amenities];
  }

  get status(): RoomStatus {
    return this._status;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  isAvailable(): boolean {
    return this._status === RoomStatus.AVAILABLE;
  }

  markAsAvailable(): void {
    this._status = RoomStatus.AVAILABLE;
  }

  markAsOccupied(): void {
    this._status = RoomStatus.OCCUPIED;
  }

  markAsReserved(): void {
    this._status = RoomStatus.RESERVED;
  }

  markAsInMaintenance(): void {
    this._status = RoomStatus.MAINTENANCE;
  }

  updatePrice(newPrice: Money): void {
    this._pricePerNight = newPrice;
  }

  updateAmenities(amenities: string[]): void {
    this._amenities = [...new Set(amenities)];
  }

  canAccommodate(numberOfGuests: number): boolean {
    return numberOfGuests <= this._capacity;
  }
}