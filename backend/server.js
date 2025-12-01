// backend/server.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookie = require("cookie");
const { Server } = require("socket.io");

// ===== Models =====
const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

// ===== App & Server =====
const app = express();
const server = http.createServer(app);
const PORT = 3000;

// ===== CORS / Socket origins =====
const ALLOWED_ORIGINS = ["http://localhost:5176"];

// ===== Middleware =====
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

// ===== Mongo Connect =====
mongoose
  .connect(process.env.MONGO_API_KEY)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ===== Helpers: JWT & Cookies =====
function signJwt(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      emailAddress: user.emailAddress,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function setAuthCookie(res, token) {
  res.cookie("cp_jwt", token, {
    httpOnly: true,
    secure: false, // true in production HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// ===== Auth Middleware =====
function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.cp_jwt;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized (no token)" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    console.error("requireAuth error:", e.message);
    return res
      .status(401)
      .json({ success: false, error: "Unauthorized (invalid token)" });
  }
}

// ====================== AUTH ROUTES ==========================

// Signup (frontend calls /api/signup; we also expose /signup for safety)
async function handleSignup(req, res) {
  try {
    console.log("🟡 [BACKEND] Signup request received:", req.body);

    const { name, emailAddress, password } = req.body;

    if (!name || !emailAddress || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const normalizedEmail = emailAddress.toLowerCase().trim();

    const exists = await User.findOne({ emailAddress: normalizedEmail });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const user = new User({
      name: name.trim(),
      emailAddress: normalizedEmail,
      password,
    });

    await user.save();

    console.log("🟢 [BACKEND] User created:", user._id);

    // (Optional) auto-login new user:
    // const token = signJwt(user);
    // setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Account created successfully.",
      user: {
        _id: user._id,
        name: user.name,
        emailAddress: user.emailAddress,
      },
    });
  } catch (err) {
    console.error("❌ [BACKEND] Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      debug: err.message,
    });
  }
}

app.post("/api/signup", handleSignup);
app.post("/signup", handleSignup); // in case frontend hits /signup

// Signin (login)
async function handleSignin(req, res) {
  try {
    const { emailAddress, password } = req.body;

    if (!emailAddress || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing login fields.",
      });
    }

    const normalizedEmail = emailAddress.toLowerCase().trim();

    const user = await User.findOne({ emailAddress: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account found for this email.",
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    const token = signJwt(user);
    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Login successful!",
      user: {
        _id: user._id,
        name: user.name,
        emailAddress: user.emailAddress,
      },
    });
  } catch (err) {
    console.error("❌ [BACKEND] Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      debug: err.message,
    });
  }
}

app.post("/api/signin", handleSignin);
app.post("/signin", handleSignin); // safety

// Current user
app.get("/api/auth/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "User not found" });
    }

    return res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        emailAddress: user.emailAddress || user.email || null,
      },
    });
  } catch (e) {
    console.error("/api/auth/me error:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Simple health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, at: "backend", ts: new Date().toISOString() });
});

// ====================== CONVERSATIONS ==========================

// Get all conversations for logged-in user
app.get("/api/conversations", requireAuth, async (req, res) => {
  try {
    const convs = await Conversation.find({ members: req.user.id })
      .select("_id name members updatedAt")
      .populate("members", "name emailAddress")
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ success: true, data: convs });
  } catch (e) {
    console.error("/api/conversations error:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Get messages for a conversation
app.get("/api/conversations/:id/messages", requireAuth, async (req, res) => {
  try {
    const convId = req.params.id;

    const permitted = await Conversation.exists({
      _id: convId,
      members: req.user.id,
    });

    if (!permitted) {
      return res
        .status(403)
        .json({ success: false, error: "Forbidden" });
    }

    const msgs = await Message.find({ conversation: convId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, data: msgs });
  } catch (e) {
    console.error(
      `/api/conversations/${req.params.id}/messages error:`,
      e
    );
    res.status(500).json({ success: false, error: e.message });
  }
});

// Create a conversation (used by "New" button)
app.post("/api/dev/seed-conv", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.json({
        success: false,
        error: "Conversation name required",
      });
    }

    const conv = await Conversation.create({
      name: name.trim(),
      members: [req.user.id],
      lastMessageAt: new Date(),
    });

    res.json({ success: true, data: conv });
  } catch (e) {
    console.error("/api/dev/seed-conv error:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// Add member to conversation by email
app.post("/api/conversations/:id/add-member", requireAuth, async (req, res) => {
  try {
    const conv = await Conversation.findOne({
      _id: req.params.id,
      members: req.user.id,
    });

    if (!conv) {
      return res
        .status(404)
        .json({ success: false, error: "Conversation not found" });
    }

    const rawEmail = req.body.email;
    if (!rawEmail) {
      return res
        .status(400)
        .json({ success: false, error: "email required" });
    }

    const emailAddress = String(rawEmail).toLowerCase().trim();

    let user = await User.findOne({ emailAddress });
    if (!user) {
      // Create a placeholder account for this invited user
      const tempPassword = await bcrypt.hash(
        "dev-placeholder-password",
        10
      );
      user = await User.create({
        name: emailAddress.split("@")[0],
        emailAddress,
        password: tempPassword, // already hashed, but our pre-save will hash again; it's dev-only so fine
      });
    }

    if (!conv.members.some((m) => String(m) === String(user._id))) {
      conv.members.push(user._id);
      await conv.save();
    }

    await conv.populate("members", "name emailAddress");

    res.json({ success: true, data: conv });
  } catch (e) {
    console.error("/api/conversations/:id/add-member error:", e);
    res.status(500).json({ success: false, error: e.message });
  }
});

// ====================== SOCKET.IO ==========================

const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
  pingTimeout: 20000,
});

// Socket auth using cp_jwt cookie
io.use((socket, next) => {
  try {
    const parsed = cookie.parse(socket.handshake.headers.cookie || "");
    const token = parsed.cp_jwt;
    if (!token) return next(new Error("Unauthorized"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: decoded.id };
    next();
  } catch (e) {
    console.error("Socket auth error:", e.message);
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Join a conversation room
  socket.on("conversation:join", ({ conversationId }) => {
    if (!conversationId) return;
    socket.join(`conv:${conversationId}`);
  });

  // Send message
  socket.on(
    "message:send",
    async ({ conversationId, text, tempId, attachments = [] }, ack) => {
      try {
        if (!conversationId || !text?.trim()) {
          return ack?.({ ok: false, error: "Missing fields" });
        }

        const msg = await Message.create({
          conversation: conversationId,
          sender: socket.user.id,
          text: text.trim(),
          attachments,
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessageAt: new Date(),
        });

        io.to(`conv:${conversationId}`).emit("message:new", {
          _id: msg._id,
          conversation: conversationId,
          sender: socket.user.id,
          text: msg.text,
          tempId,
          createdAt: msg.createdAt,
        });

        ack?.({ ok: true, messageId: msg._id.toString() });
      } catch (e) {
        console.error("message:send error:", e);
        ack?.({ ok: false, error: e.message });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ====================== START SERVER ==========================

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
