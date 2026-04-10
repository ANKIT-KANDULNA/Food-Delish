const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },
    price:       { type: Number, required: true, min: 0 },
    category:    { type: String, required: true, index: true },
    image:       { type: String },                          // Cloudinary URL
    isVeg:       { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true, index: true },

    // Tags for filtering
    tags: [{ type: String }],

    // Ratings
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount:   { type: Number, default: 0 },

    // Promo / discount
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

// Text search index
menuItemSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("MenuItem", menuItemSchema);
