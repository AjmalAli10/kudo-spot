const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Badge = require("../models/Badge");

dotenv.config();

const testUsers = [
  { name: "Jay" },
  { name: "Jill" },
  { name: "Johnny" },
  { name: "Gabe" },
];

const badges = [
  {
    name: "Helping Hand",
    description: "For helping teammates with their tasks",
  },
  {
    name: "Excellence",
    description: "For delivering exceptional quality work",
  },
  {
    name: "Above and Beyond",
    description: "For going beyond expectations",
  },
  {
    name: "Client Focus",
    description: "For exceptional client service",
  },
];

async function initializeData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Initialize badges
    for (const badge of badges) {
      await Badge.findOneAndUpdate({ name: badge.name }, badge, {
        upsert: true,
        new: true,
      });
    }
    console.log("Badges initialized");

    // Initialize users
    for (const user of testUsers) {
      await User.findOneAndUpdate({ name: user.name }, user, {
        upsert: true,
        new: true,
      });
    }
    console.log("Test users initialized");

    console.log("Data initialization complete");
    process.exit(0);
  } catch (error) {
    console.error("Error initializing data:", error);
    process.exit(1);
  }
}

initializeData();
