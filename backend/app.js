// app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Database init (ensure this file connects on require)
require("./models/db");

const leetcodeRoutes = require("./routes/leetcode");
const userRouter = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 8000;

// ----- Middleware (order matters) -----
app.use(cors());
app.use(express.json());

// ----- Routes -----
app.use("/api", leetcodeRoutes); // -> /api/leetcode/:username/stats
app.use("/api", userRouter);

app.get("/test", (_req, res) => {
  res.send("Hello world");
});

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Welcome!" });
});

// ----- Start server (only once) -----
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
