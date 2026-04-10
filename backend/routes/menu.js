const express = require("express");
const router = express.Router();
const { body, validationResult, query } = require("express-validator");
const MenuItem = require("../models/MenuItem");
const { protect, adminOnly } = require("../middleware/protect");
const logger = require("../utils/logger");

// ─── Public Routes ────────────────────────────────────────────────────────────

// GET /api/menu  — list all available items (with search, filter, pagination)
router.get("/", async (req, res) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page) || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 20);
    const skip     = (page - 1) * limit;
    const search   = req.query.search?.trim();
    const category = req.query.category?.trim();
    const isVeg    = req.query.isVeg;
    const sort     = req.query.sort || "name"; // name | price | rating

    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (isVeg !== undefined) filter.isVeg = isVeg === "true";
    if (search) filter.$text = { $search: search };

    const sortMap = {
      name:   { name: 1 },
      price:  { price: 1 },
      rating: { averageRating: -1 },
    };

    const [items, total] = await Promise.all([
      MenuItem.find(filter)
        .sort(sortMap[sort] || { name: 1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
      MenuItem.countDocuments(filter),
    ]);

    res.json({ items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    logger.error("Get menu error", { error: err.message });
    res.status(500).json({ message: "Could not fetch menu" });
  }
});

// GET /api/menu/categories  — distinct categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await MenuItem.distinct("category", { isAvailable: true });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch categories" });
  }
});

// GET /api/menu/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).select("-__v");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch item" });
  }
});

// ─── Admin Routes ─────────────────────────────────────────────────────────────

const itemValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("category").trim().notEmpty().withMessage("Category is required"),
];

// POST /api/menu  — create item (admin)
router.post("/", protect, adminOnly, itemValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ message: errors.array()[0].msg });

  try {
    const item = await MenuItem.create(req.body);
    logger.info("Menu item created", { name: item.name });
    res.status(201).json({ message: "Item created", item });
  } catch (err) {
    logger.error("Create menu item error", { error: err.message });
    res.status(500).json({ message: "Could not create item" });
  }
});

// PUT /api/menu/:id  — update item (admin)
router.put("/:id", protect, adminOnly, itemValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ message: errors.array()[0].msg });

  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    logger.info("Menu item updated", { id: req.params.id });
    res.json({ message: "Item updated", item });
  } catch (err) {
    logger.error("Update menu item error", { error: err.message });
    res.status(500).json({ message: "Could not update item" });
  }
});

// PATCH /api/menu/:id/toggle  — toggle availability (admin)
router.patch("/:id/toggle", protect, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.json({ message: `Item is now ${item.isAvailable ? "available" : "unavailable"}`, item });
  } catch (err) {
    res.status(500).json({ message: "Could not toggle item" });
  }
});

// DELETE /api/menu/:id  — delete item (admin)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    logger.info("Menu item deleted", { id: req.params.id });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete item" });
  }
});

module.exports = router;
