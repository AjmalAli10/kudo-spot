const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["Helping Hand", "Excellence", "Above and Beyond", "Client Focus"],
  },
  description: {
    type: String,
    required: true,
  },
  timesAwarded: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Badge", badgeSchema);
