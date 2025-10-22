import { Payment, PaymentStatus } from '../entities/Payment';

export interface IPaymentRepository {
  save(payment: Payment): Promise<void>;
  findById(id: string): Promise<Payment | null>;
  findByReservationId(reservationId: string): Promise<Payment[]>;
  update(payment: Payment): Promise<void>;
  findByStatus(status: PaymentStatus): Promise<Payment[]>;
  findAll(): Promise<Payment[]>;
}