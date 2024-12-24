const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require("./routes/users");
const kudosRoutes = require("./routes/kudos");
const badgeRoutes = require("./routes/badges");
const analyticsRoutes = require("./routes/analytics");

app.use("/api/users", userRoutes);
app.use("/api/kudos", kudosRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/analytics", analyticsRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Basic route
app.get("/", (req, res) => {
  res.send("KudoSpot API is running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
