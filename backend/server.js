/* ========================= ENV ========================= */
require("dotenv").config();

/* ========================= IMPORTS ========================= */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const http = require("http");
const { Server } = require("socket.io");

/* Models */
const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

/* Controllers */
const AuthController = require("./controllers/AuthController.js");
const GroupController = require("./controllers/GroupController.js");
const UserController = require("./controllers/UserController.js");
const AdminController = require("./controllers/AdminController.js");
const InviteController = require("./controllers/InviteController.js");
const AIController = require("./controllers/AIController.js");
const UserDetails = require("./controllers/UserDetails.js");

/* Routes */
const forumRoutes = require("./routes/forum");
const adzunaRoutes = require("./routes/adzuna");
const notificationRoutes = require("./routes/notificationsRoutes");
const reminderRoutes = require("./routes/remindersRoutes");

/* ========================= SETUP ========================= */
const app = express();
const server = http.createServer(app);

const PORT = 3000;
const ALLOWED_ORIGINS = ["http://localhost:5176"];

/* SOCKET.IO */
const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, credentials: true },
  pingTimeout: 20000,
});

/* ========================= MIDDLEWARE ========================= */
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.static("src"));

/* ========================= HEALTH CHECK ========================= */
app.get("/", (req, res) => res.send("Backend is running!"));

/* ========================= MONGO CONNECT ========================= */
mongoose
  .connect(process.env.MONGO_API_KEY)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ========================= AUTH ========================= */
app.post("/signup", AuthController.createUser);
app.post("/signin", AuthController.userSignIn);

function requireAuth(req, res, next) {
  try {
    const tok = req.cookies?.cp_jwt;
    if (!tok) return res.status(401).json({ success: false, error: "Unauthorized" });

    const payload = jwt.verify(tok, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
}

app.get("/api/auth/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("email fullname name _id");
  if (!user) return res.status(404).json({ success: false, error: "User not found" });
  res.json({ success: true, data: user });
});

/* ========================= GROUP ROUTES ========================= */
app.get("/addGroupData", GroupController.addGroupData);
app.get("/getGroupList", GroupController.getGroupList);
app.get("/searchForEntry", GroupController.searchForEntry);
app.get("/getMembers", GroupController.getMembers);
app.get("/deleteUserFromGroup", GroupController.deleteUserFromGroup);
app.get("/findCodeGroup", GroupController.groupJoinCode);
app.get("/getGroupCode", GroupController.getJoinCode);

/* ========================= USER ROUTES ========================= */
app.get("/changeUserGroups", UserController.changeUserGroups);
app.get("/userGroupList", UserController.userGroupList);
app.get("/deleteEntry", UserController.deleteEntry);
app.get("/searchForUser", UserController.searchForUser);

/* ========================= ADMIN ROUTES ========================= */
app.get("/getAdminGroupList", AdminController.getAdminGroupList);

/* ========================= INVITE ROUTES ========================= */
app.get("/getInvites", InviteController.getInvites);
app.get("/makeInvite", InviteController.makeInvite);
app.get("/acceptInvite", InviteController.acceptInvite);

/* ========================= AI ROUTES ========================= */
app.get("/addInterviewAnswer", AIController.addInterviewAnswer);
app.get("/chatWithInterviewer", AIController.chatWithInterviewer);
app.get("/chat", AIController.chat);
app.get("/finishInterview", AIController.getSummary);

/* ========================= USER DETAILS ========================= */
app.get("/getUserDetails", UserDetails.fetchCurrentUser);

/* ========================= ADDITIONAL ROUTES ========================= */
app.use("/api/forum", forumRoutes);
app.use("/api/adzuna", adzunaRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reminders", reminderRoutes);

/* ========================= CONVERSATIONS ========================= */
app.get("/api/conversations", requireAuth, async (req, res) => {
  const convs = await Conversation.find({ members: req.user.id })
    .select("_id name updatedAt members")
    .populate("members", "email fullname name")
    .sort({ updatedAt: -1 })
    .lean();

  res.json({ success: true, data: convs });
});

app.get("/api/conversations/:id/messages", requireAuth, async (req, res) => {
  const { id } = req.params;

  const member = await Conversation.exists({ _id: id, members: req.user.id });
  if (!member) return res.status(403).json({ success: false, error: "Forbidden" });

  const msgs = await Message.find({ conversation: id }).sort({ createdAt: 1 }).lean();
  res.json({ success: true, data: msgs });
});

/* Create conversation */
app.post("/api/dev/seed-conv", requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    const conv = await Conversation.create({
      name,
      members: [req.user.id],
      lastMessageAt: new Date(),
    });
    res.json({ success: true, data: conv });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/* Add member */
app.post("/api/conversations/:id/add-member", requireAuth, async (req, res) => {
  try {
    const email = String(req.body.email).toLowerCase().trim();

    const conv = await Conversation.findOne({
      _id: req.params.id,
      members: req.user.id,
    });

    if (!conv) return res.status(404).json({ success: false, error: "Conversation not found" });

    let user = await User.findOne({ email });
    if (!user) {
      const hash = await bcrypt.hash("dev-placeholder-password", 10);
      user = await User.create({
        email,
        fullname: email.split("@")[0],
        passwordHash: hash,
      });
    }

    if (!conv.members.includes(user._id)) {
      conv.members.push(user._id);
      await conv.save();
    }

    await conv.populate("members", "fullname email name");

    res.json({
      success: true,
      data: conv,
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/* ========================= SOCKET.IO ========================= */
io.use((socket, next) => {
  try {
    const parsed = cookie.parse(socket.handshake.headers?.cookie || "");
    const tok = parsed.cp_jwt;
    if (!tok) return next(new Error("Unauthorized"));
    const payload = jwt.verify(tok, process.env.JWT_SECRET);
    socket.user = { _id: payload.id };
    next();
  } catch {
    next(new Error("Unauthorized"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.user._id;
  console.log("🟢 Socket connected:", socket.id);

  /* Join conversation */
  socket.on("conversation:join", ({ conversationId }) => {
    socket.join(`conv:${conversationId}`);
  });

  /* Send message */
  socket.on("message:send", async ({ conversationId, text, attachments = [] }, ack) => {
    try {
      const member = await Conversation.exists({
        _id: conversationId,
        members: userId,
      });
      if (!member) throw new Error("Forbidden");

      const msg = await Message.create({
        conversation: conversationId,
        sender: userId,
        text,
        attachments,
      });

      await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });

      io.to(`conv:${conversationId}`).emit("message:new", {
        _id: msg._id.toString(),
        conversation: conversationId,
        sender: userId,
        text,
        attachments,
        createdAt: msg.createdAt,
      });

      ack?.({ ok: true });
    } catch (e) {
      ack?.({ ok: false, error: e.message });
    }
  });
});

/* ========================= START ========================= */
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
