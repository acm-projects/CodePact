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

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Bad JSON body' });
  }
  next(err);
});

// ----- Routes -----
app.use("/api", leetcodeRoutes); // -> /api/leetcode/:username/stats
app.use("/api", userRouter);

app.use((err, req, res, next) => {
  // helpful server-side log
  console.error('❌ Error', {
    msg: err?.message,
    status: err?.status || err?.response?.status,
    url: err?.url || err?.config?.url,
    detail: typeof err?.detail === 'string' ? err.detail.slice(0, 200) : err?.detail,
  });

  const status = err?.status || err?.response?.status || 500;
  const detail = err?.detail || err?.response?.data || err?.message || 'Server error';
  res.status(status).json({
    success: false,
    message: 'Request failed',
    detail,
    url: err?.url || err?.config?.url,
  });
});


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
