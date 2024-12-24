const mongoose = require("mongoose");

const kudosSchema = new mongoose.Schema({
  fromUser: {
    type: String,
    required: true,
    ref: "User",
  },
  toUser: {
    type: String,
    required: true,
    ref: "User",
  },
  badge: {
    type: String,
    required: true,
    enum: ["Helping Hand", "Excellence", "Above and Beyond", "Client Focus"],
  },
  message: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: String,
      ref: "User",
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Kudos", kudosSchema);
