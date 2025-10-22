import { IPaymentRepository } from '@hotel/domain/src/repositories/IPaymentRepository';
import { Payment, PaymentStatus } from '@hotel/domain/src/entities/Payment';

export class InMemoryPaymentRepository implements IPaymentRepository {
  private payments: Map<string, Payment> = new Map();

  async save(payment: Payment): Promise<void> {
    this.payments.set(payment.id, payment);
  }

  async findById(id: string): Promise<Payment | null> {
    return this.payments.get(id) || null;
  }

  async findByReservationId(reservationId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      payment => payment.reservationId === reservationId
    );
  }

  async update(payment: Payment): Promise<void> {
    if (!this.payments.has(payment.id)) {
      throw new Error('Payment not found');
    }
    this.payments.set(payment.id, payment);
  }

  async findByStatus(status: PaymentStatus): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(
      payment => payment.status === status
    );
  }

  async findAll(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }
}