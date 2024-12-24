const express = require("express");
const router = express.Router();
const Kudos = require("../models/Kudos");
const User = require("../models/User");

// Get kudos statistics by badge type
router.get("/kudos-by-badge", async (req, res) => {
  try {
    const stats = await Kudos.aggregate([
      {
        $group: {
          _id: "$badge",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .sort({ kudosReceived: -1 })
      .limit(10)
      .select("name kudosReceived");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get most liked kudos
router.get("/most-liked", async (req, res) => {
  try {
    const kudos = await Kudos.find().sort({ likes: -1 }).limit(5);
    res.json(kudos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user statistics
router.get("/user-stats/:userName", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.userName });
    const kudosGiven = await Kudos.find({
      fromUser: req.params.userName,
    }).count();
    const kudosReceived = await Kudos.find({
      toUser: req.params.userName,
    }).count();
    const mostReceivedBadge = await Kudos.aggregate([
      { $match: { toUser: req.params.userName } },
      { $group: { _id: "$badge", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    res.json({
      user,
      stats: {
        kudosGiven,
        kudosReceived,
        mostReceivedBadge: mostReceivedBadge[0] || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
