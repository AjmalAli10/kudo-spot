const express = require("express");
const router = express.Router();
const Badge = require("../models/Badge");

// Get all badges
router.get("/", async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Initialize badges (if not exists)
router.post("/init", async (req, res) => {
  try {
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

    for (const badge of badges) {
      await Badge.findOneAndUpdate({ name: badge.name }, badge, {
        upsert: true,
        new: true,
      });
    }

    const allBadges = await Badge.find();
    res.json(allBadges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
