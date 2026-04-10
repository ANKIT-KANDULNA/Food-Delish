const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String },   // nullable for Google-only users
    photo:    { type: String },
    role:     { type: String, enum: ["user", "admin"], default: "user", index: true },

    // Saved delivery addresses
    addresses: [
      {
        label:       { type: String },   // "Home", "Work", etc.
        fullName:    { type: String },
        phone:       { type: String },
        addressLine: { type: String },
        city:        { type: String },
        pincode:     { type: String },
        isDefault:   { type: Boolean, default: false },
      },
    ],

    // Refresh token for JWT rotation
    refreshToken: { type: String, default: null },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);