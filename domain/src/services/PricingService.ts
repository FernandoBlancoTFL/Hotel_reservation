import { Money } from '../value-objects/Money';
import { DateRange } from '../value-objects/DateRange';

export class PricingService {
  static calculateTotalPrice(pricePerNight: Money, dateRange: DateRange): Money {
    const numberOfNights = dateRange.numberOfNights();
    return pricePerNight.multiply(numberOfNights);
  }

  static applyDiscount(price: Money, discountPercentage: number): Money {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error('Discount percentage must be between 0 and 100');
    }

    const discountMultiplier = (100 - discountPercentage) / 100;
    return new Money(price.amount * discountMultiplier, price.currency);
  }

  static calculateRefundAmount(totalPrice: Money, daysBeforeCheckIn: number): Money {
    if (daysBeforeCheckIn < 0) {
      throw new Error('Days before check-in cannot be negative');
    }

    // Refund policy:
    // - 7+ days before: 100% refund
    // - 3-6 days before: 50% refund
    // - Less than 3 days: No refund

    if (daysBeforeCheckIn >= 7) {
      return totalPrice;
    } else if (daysBeforeCheckIn >= 3) {
      return new Money(totalPrice.amount * 0.5, totalPrice.currency);
    } else {
      return new Money(0, totalPrice.currency);
    }
  }
}