require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const email = process.argv[2];

if (!email) {
  console.log("Please provide an email. Usage: node promote-admin.js your-email@example.com");
  process.exit(1);
}

async function promote() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find user and update role
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: "admin" },
      { new: true }
    );

    if (user) {
      console.log(`\n✅ SUCCESS: User "${user.email}" has been promoted to ADMIN.`);
      console.log("You can now access the Admin Panel after logging back in.");
    } else {
      console.log(`\n❌ ERROR: User with email "${email}" not found in the database.`);
      console.log("Make sure you have signed up in the app first!");
    }
  } catch (err) {
    console.error("\n❌ ERROR connecting to MongoDB:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

promote();
