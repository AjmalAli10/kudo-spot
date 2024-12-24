const express = require("express");
const router = express.Router();
const Kudos = require("../models/Kudos");
const User = require("../models/User");
const Badge = require("../models/Badge");

// Get all kudos (with pagination)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const kudos = await Kudos.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Kudos.countDocuments();

    res.json({
      kudos,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalKudos: total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new kudos
router.post("/", async (req, res) => {
  try {
    const kudos = new Kudos({
      fromUser: req.body.fromUser,
      toUser: req.body.toUser,
      badge: req.body.badge,
      message: req.body.message,
    });

    // Update user kudos counts
    await User.findOneAndUpdate(
      { name: req.body.fromUser },
      { $inc: { kudosGiven: 1 } }
    );
    await User.findOneAndUpdate(
      { name: req.body.toUser },
      { $inc: { kudosReceived: 1 } }
    );

    // Update badge count
    await Badge.findOneAndUpdate(
      { name: req.body.badge },
      { $inc: { timesAwarded: 1 } }
    );

    const newKudos = await kudos.save();
    res.status(201).json(newKudos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Like a kudos
router.post("/:id/like", async (req, res) => {
  try {
    const kudos = await Kudos.findById(req.params.id);
    if (!kudos) {
      return res.status(404).json({ message: "Kudos not found" });
    }

    const userName = req.body.userName;
    if (kudos.likedBy.includes(userName)) {
      return res.status(400).json({ message: "User already liked this kudos" });
    }

    kudos.likes += 1;
    kudos.likedBy.push(userName);
    await kudos.save();

    res.json(kudos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get kudos by user
router.get("/user/:userName", async (req, res) => {
  try {
    const kudos = await Kudos.find({
      $or: [{ fromUser: req.params.userName }, { toUser: req.params.userName }],
    }).sort({ timestamp: -1 });
    res.json(kudos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
