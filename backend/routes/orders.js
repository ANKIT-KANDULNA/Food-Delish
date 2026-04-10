const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { body, validationResult, param, query } = require("express-validator");
const Order = require("../models/Order");
const { protect, adminOnly } = require("../middleware/protect");
const logger = require("../utils/logger");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ORDER_STATUSES = ["placed", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

function calcEstimatedDelivery() {
  const d = new Date();
  d.setMinutes(d.getMinutes() + 35); // 35 min estimated
  return d;
}

// ─── User Routes ──────────────────────────────────────────────────────────────

// POST /api/orders  — place a new order
router.post(
  "/",
  protect,
  [
    body("items").isArray({ min: 1 }).withMessage("Cart cannot be empty"),
    body("items.*.name").notEmpty().withMessage("Item name is required"),
    body("items.*.price").isFloat({ min: 0 }).withMessage("Item price must be positive"),
    body("items.*.quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
    body("deliveryAddress.fullName").notEmpty().withMessage("Full name is required"),
    body("deliveryAddress.phone").notEmpty().withMessage("Phone is required"),
    body("deliveryAddress.addressLine").notEmpty().withMessage("Address is required"),
    body("deliveryAddress.city").notEmpty().withMessage("City is required"),
    body("deliveryAddress.pincode").notEmpty().withMessage("Pincode is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array()[0].msg });
    }

    try {
      const { items, deliveryAddress, paymentMethod = "cod", promoCode } = req.body;

      const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const deliveryFee = subtotal > 499 ? 0 : 40;
      // Basic promo: "FIRST50" gives ₹50 off
      const discount = promoCode === "FIRST50" ? 50 : 0;
      const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

      const orderId = `FD-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;

      const order = await Order.create({
        orderId,
        user: req.user.id,
        items,
        subtotal,
        deliveryFee,
        discount,
        totalAmount,
        deliveryAddress,
        paymentMethod,
        promoCode: promoCode || undefined,
        estimatedDelivery: calcEstimatedDelivery(),
        statusHistory: [{ status: "placed", note: "Order placed by customer" }],
      });

      logger.info("Order placed", { orderId, userId: req.user.id, totalAmount });
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
      logger.error("Place order error", { error: err.message });
      res.status(500).json({ message: "Could not place order. Please try again." });
    }
  }
);

// GET /api/orders/my  — current user's order history (paginated)
router.get("/my", protect, async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
      Order.countDocuments({ user: req.user.id }),
    ]);

    res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    logger.error("Get my orders error", { error: err.message });
    res.status(500).json({ message: "Could not fetch orders" });
  }
});

// GET /api/orders/:id  — get single order (owner or admin)
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Allow only owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ order });
  } catch (err) {
    logger.error("Get order error", { error: err.message });
    res.status(500).json({ message: "Could not fetch order" });
  }
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

// GET /api/orders  — all orders (admin)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page) || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 20);
    const status = req.query.status;
    const skip   = (page - 1) * limit;

    const filter = status ? { status } : {};
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")
        .select("-__v"),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    logger.error("Admin get orders error", { error: err.message });
    res.status(500).json({ message: "Could not fetch orders" });
  }
});

// PATCH /api/orders/:id/status  — update order status (admin)
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  [body("status").isIn(ORDER_STATUSES).withMessage("Invalid status")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ message: errors.array()[0].msg });

    try {
      const { status, note } = req.body;
      const order = await Order.findOne({ orderId: req.params.id });
      if (!order) return res.status(404).json({ message: "Order not found" });

      order.status = status;
      order.statusHistory.push({ status, note: note || "", timestamp: new Date() });

      // Auto-mark payment for COD on delivery
      if (status === "delivered" && order.paymentMethod === "cod") {
        order.paymentStatus = "paid";
      }
      if (status === "cancelled") {
        order.paymentStatus = order.paymentStatus === "paid" ? "refunded" : "failed";
      }

      await order.save();
      logger.info("Order status updated", { orderId: order.orderId, status });
      res.json({ message: "Order status updated", order });
    } catch (err) {
      logger.error("Update order status error", { error: err.message });
      res.status(500).json({ message: "Could not update order status" });
    }
  }
);

// GET /api/orders/admin/analytics  — revenue & stats (admin)
router.get("/admin/analytics", protect, adminOnly, async (req, res) => {
  try {
    const [revenueData, statusBreakdown, recentOrders] = await Promise.all([
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 30 },
      ]),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "name email")
        .select("orderId totalAmount status createdAt user"),
    ]);

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      revenueByDay: revenueData,
      statusBreakdown,
      recentOrders,
    });
  } catch (err) {
    logger.error("Analytics error", { error: err.message });
    res.status(500).json({ message: "Could not fetch analytics" });
  }
});

module.exports = router;
