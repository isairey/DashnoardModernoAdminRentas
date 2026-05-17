const Reservation = require('../models/Reservation');
const Product = require('../models/Product');

// Check product availability for given dates
exports.checkAvailability = async (productId, startDate, endDate, requestedQuantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  // Find overlapping reservations
  const overlappingReservations = await Reservation.find({
    product: productId,
    status: { $in: ['reserved', 'active'] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ]
  });

  // Calculate reserved quantity for the period
  let reservedQuantity = 0;
  overlappingReservations.forEach(reservation => {
    reservedQuantity += reservation.quantity;
  });

  const availableQuantity = product.inventory.totalQuantity - reservedQuantity;
  const isAvailable = availableQuantity >= requestedQuantity;

  return {
    isAvailable,
    availableQuantity,
    totalQuantity: product.inventory.totalQuantity,
    reservedQuantity
  };
};

// Create a reservation
exports.createReservation = async (reservationData) => {
  const reservation = await Reservation.create(reservationData);

  // Update product available quantity
  await Product.findByIdAndUpdate(reservationData.product, {
    $inc: { 'inventory.availableQuantity': -reservationData.quantity }
  });

  return reservation;
};

// Update reservation status
exports.updateReservationStatus = async (orderId, status) => {
  await Reservation.updateMany(
    { order: orderId },
    { status }
  );
};

// Release inventory when order is completed or cancelled
exports.releaseInventory = async (productId, quantity) => {
  await Product.findByIdAndUpdate(productId, {
    $inc: { 'inventory.availableQuantity': quantity }
  });
};

// Get reservations for a product
exports.getProductReservations = async (productId, startDate, endDate) => {
  const query = {
    product: productId,
    status: { $in: ['reserved', 'active'] }
  };

  if (startDate && endDate) {
    query.$or = [
      {
        startDate: { $lte: new Date(endDate) },
        endDate: { $gte: new Date(startDate) }
      }
    ];
  }

  return await Reservation.find(query)
    .populate('customer', 'name')
    .populate('order', 'orderNumber');
};

// Cancel reservation
exports.cancelReservation = async (reservationId) => {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  reservation.status = 'cancelled';
  await reservation.save();

  // Release inventory
  await this.releaseInventory(reservation.product, reservation.quantity);

  return reservation;
};
