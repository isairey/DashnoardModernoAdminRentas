// Calculate rental price based on duration
exports.calculateRentalPrice = (pricing, duration, quantity = 1) => {
  let pricePerUnit;
  
  // Determine best pricing tier
  if (duration >= 30 && pricing.monthly > 0) {
    // Monthly pricing
    const months = Math.ceil(duration / 30);
    pricePerUnit = pricing.monthly * months;
  } else if (duration >= 7 && pricing.weekly > 0) {
    // Weekly pricing
    const weeks = Math.ceil(duration / 7);
    pricePerUnit = pricing.weekly * weeks;
  } else if (duration >= 1) {
    // Daily pricing
    pricePerUnit = pricing.daily * duration;
  } else if (pricing.hourly > 0) {
    // Hourly pricing (duration in hours)
    pricePerUnit = pricing.hourly * duration;
  } else {
    // Default to daily
    pricePerUnit = pricing.daily;
  }
  
  return pricePerUnit * quantity;
};

// Calculate discount based on duration
exports.calculateDiscount = (totalPrice, duration) => {
  let discountPercent = 0;
  
  if (duration >= 30) {
    discountPercent = 15; // 15% discount for monthly
  } else if (duration >= 14) {
    discountPercent = 10; // 10% discount for 2+ weeks
  } else if (duration >= 7) {
    discountPercent = 5; // 5% discount for weekly
  }
  
  return (totalPrice * discountPercent) / 100;
};

// Calculate late fee
exports.calculateLateFee = (dailyRate, daysLate) => {
  // Late fee is 1.5x the daily rate
  return dailyRate * 1.5 * daysLate;
};

// Calculate tax
exports.calculateTax = (amount, taxRate = 0.1) => {
  return amount * taxRate;
};

// Get pricing breakdown
exports.getPricingBreakdown = (pricing, duration, quantity = 1, taxRate = 0.1) => {
  const subtotal = this.calculateRentalPrice(pricing, duration, quantity);
  const discount = this.calculateDiscount(subtotal, duration);
  const subtotalAfterDiscount = subtotal - discount;
  const tax = this.calculateTax(subtotalAfterDiscount, taxRate);
  const securityDeposit = pricing.securityDeposit * quantity;
  const total = subtotalAfterDiscount + tax + securityDeposit;
  
  return {
    subtotal,
    discount,
    subtotalAfterDiscount,
    tax,
    securityDeposit,
    total,
    pricePerDay: pricing.daily,
    duration,
    quantity
  };
};
