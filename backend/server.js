require("dotenv").config();
const dns = require("dns");

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
  origin:"https://food-delish.vercel.app"
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});