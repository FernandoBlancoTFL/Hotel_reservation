export type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE';

export interface Room {
  id: string;
  number: string;
  type: RoomType;
  pricePerNight: {
    amount: number;
    currency: string;
  };
  capacity: number;
  amenities: string[];
  isAvailable?: boolean;
}

export interface RoomSearchCriteria {
  checkInDate: string;
  checkOutDate: string;
  capacity?: number;
  roomType?: RoomType;
}