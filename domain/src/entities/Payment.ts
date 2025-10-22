import { Money } from '../value-objects/Money';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  CASH = 'CASH',
  TRANSFER = 'TRANSFER'
}

export class Payment {
  private _id: string;
  private _reservationId: string;
  private _amount: Money;
  private _method: PaymentMethod;
  private _status: PaymentStatus;
  private _transactionId?: string;
  private _failureReason?: string;
  private _refundReason?: string;
  private _createdAt: Date;
  private _completedAt?: Date;

  constructor(
    id: string,
    reservationId: string,
    amount: Money,
    method: PaymentMethod
  ) {
    this._id = id;
    this._reservationId = reservationId;
    this._amount = amount;
    this._method = method;
    this._status = PaymentStatus.PENDING;
    this._createdAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get reservationId(): string {
    return this._reservationId;
  }

  get amount(): Money {
    return this._amount;
  }

  get method(): PaymentMethod {
    return this._method;
  }

  get status(): PaymentStatus {
    return this._status;
  }

  get transactionId(): string | undefined {
    return this._transactionId;
  }

  get failureReason(): string | undefined {
    return this._failureReason;
  }

  get refundReason(): string | undefined {
    return this._refundReason;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get completedAt(): Date | undefined {
    return this._completedAt ? new Date(this._completedAt) : undefined;
  }

  complete(transactionId: string): void {
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be completed');
    }
    if (!transactionId || transactionId.trim() === '') {
      throw new Error('Transaction ID cannot be empty');
    }
    this._status = PaymentStatus.COMPLETED;
    this._transactionId = transactionId;
    this._completedAt = new Date();
  }

  fail(reason: string): void {
    if (this._status !== PaymentStatus.PENDING) {
      throw new Error('Only pending payments can be marked as failed');
    }
    if (!reason || reason.trim() === '') {
      throw new Error('Failure reason cannot be empty');
    }
    this._status = PaymentStatus.FAILED;
    this._failureReason = reason;
  }

  refund(reason: string): void {
    if (this._status !== PaymentStatus.COMPLETED) {
      throw new Error('Only completed payments can be refunded');
    }
    if (!reason || reason.trim() === '') {
      throw new Error('Refund reason cannot be empty');
    }
    this._status = PaymentStatus.REFUNDED;
    this._refundReason = reason;
  }

  isPending(): boolean {
    return this._status === PaymentStatus.PENDING;
  }

  isCompleted(): boolean {
    return this._status === PaymentStatus.COMPLETED;
  }

  isRefunded(): boolean {
    return this._status === PaymentStatus.REFUNDED;
  }

  isFailed(): boolean {
    return this._status === PaymentStatus.FAILED;
  }
}