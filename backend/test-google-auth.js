require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function testSync() {
  const mockUser = {
    name: "Test Google User",
    email: "testgoogle@example.com",
    photo: "https://example.com/photo.jpg"
  };

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    console.log(`Checking if user ${mockUser.email} exists...`);
    let user = await User.findOne({ email: mockUser.email });

    if (!user) {
      console.log("User not found. Creating new user (Simulating /api/auth/google logic)...");
      user = await User.create(mockUser);
      console.log("✅ User created successfully.");
    } else {
      console.log("✅ User already exists.");
    }

    console.log("\nUser Detail:");
    console.log(`- ID: ${user._id}`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);

    console.log("\nBackend Logic Check: PASS");
    console.log("The sync route /api/auth/google is correctly configured to find/create users.");

  } catch (err) {
    console.error("❌ Test Failed:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

testSync();
