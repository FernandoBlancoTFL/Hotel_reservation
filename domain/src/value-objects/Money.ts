export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }

    if (!currency || currency.trim() === '') {
      throw new Error('Currency cannot be empty');
    }

    this._amount = Math.round(amount * 100) / 100;
    this._currency = currency.toUpperCase();
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot subtract different currencies');
    }
    const result = this._amount - other._amount;
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return new Money(result, this._currency);
  }

  multiply(multiplier: number): Money {
    if (multiplier < 0) {
      throw new Error('Multiplier cannot be negative');
    }
    return new Money(this._amount * multiplier, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  isGreaterThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this._amount > other._amount;
  }

  isLessThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this._amount < other._amount;
  }

  toString(): string {
    return `${this._currency} ${this._amount.toFixed(2)}`;
  }
}