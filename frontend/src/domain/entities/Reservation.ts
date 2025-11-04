export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  status: ReservationStatus;
  totalPrice?: number;
  room?: {
    number: string;
    type: string;
  };
}

export interface CreateReservationDTO {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}