require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const MenuItem = require("./models/MenuItem");

const DATA_PATH = "C:\\Users\\ankit\\Desktop\\Projects\\food-delish-api\\data\\menu_data.json";

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    if (!fs.existsSync(DATA_PATH)) {
      console.error(`❌ Data file not found at: ${DATA_PATH}`);
      process.exit(1);
    }

    const rawData = fs.readFileSync(DATA_PATH);
    const data = JSON.parse(rawData);

    console.log("Cleaning existing menu items...");
    await MenuItem.deleteMany({});

    let itemsToInsert = [];

    data.categories.forEach(category => {
      category.items.forEach(item => {
        itemsToInsert.push({
          name: item.name,
          description: item.description || "",
          prices: item.prices, // Already a Map/Object
          category: category.name,
          image: item.image,
          isVeg: item.tags?.includes("vegetarian") || false,
          ingredients: item.ingredients || [],
          calories: item.calories || {},
          spiceLevel: item.spiceLevel || "medium",
          tags: item.tags || [],
          averageRating: item.averageRating || 4.2 + (Math.random() * 0.7), // Add some sample ratings
          ratingCount: Math.floor(Math.random() * 500) + 50
        });
      });
    });

    console.log(`Inserting ${itemsToInsert.length} items...`);
    await MenuItem.insertMany(itemsToInsert);

    console.log("\n✅ Database seeded successfully!");
  } catch (err) {
    console.error("\n❌ Seeding error:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
