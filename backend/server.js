require("dotenv").config();
const dns = require('dns');

const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(5000, () => console.log("Server running on https://food-delish.vercel.app/login"));