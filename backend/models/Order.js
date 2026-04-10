const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name:       { type: String, required: true },
  variant:    { type: String }, // e.g. "half", "full"
  price:      { type: Number, required: true },
  quantity:   { type: Number, required: true, min: 1 },
  image:      { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    orderId:   { type: String, required: true, unique: true, index: true },
    user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items:     [orderItemSchema],

    // Pricing
    subtotal:     { type: Number, required: true },
    deliveryFee:  { type: Number, default: 40 },
    discount:     { type: Number, default: 0 },
    totalAmount:  { type: Number, required: true },

    // Delivery
    deliveryAddress: {
      fullName:    { type: String, required: true },
      phone:       { type: String, required: true },
      addressLine: { type: String, required: true },
      city:        { type: String, required: true },
      pincode:     { type: String, required: true },
    },

    // Order lifecycle status
    status: {
      type: String,
      enum: ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "placed",
      index: true,
    },

    // Status history for tracking timeline
    statusHistory: [
      {
        status:    { type: String },
        timestamp: { type: Date, default: Date.now },
        note:      { type: String },
      },
    ],

    // Payment
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentMethod: { type: String, enum: ["razorpay", "cod"], default: "cod" },
    razorpayOrderId:   { type: String },
    razorpayPaymentId: { type: String },

    // Promo
    promoCode:       { type: String },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

// Compound index for fast user order lookups
orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
