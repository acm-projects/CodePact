require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const session = require("express-session");

// ======================= CONTROLLERS ======================= //
const AuthController = require("./controllers/AuthController.js");
const GroupController = require("./controllers/GroupController.js");
const UserController = require("./controllers/UserController.js");
const AdminController = require("./controllers/AdminController.js");
const InviteController = require("./controllers/InviteController.js");
const AIController = require("./controllers/AIController.js");
const UserDetails = require("./controllers/UserDetails.js");

const app = express();
const PORT = 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// ======================= MIDDLEWARE ======================= //
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5176",
    credentials: true,
  })
);
app.use(express.static("src"));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ======================= MONGODB CONNECTION ======================= //
mongoose
  .connect(process.env.MONGO_API_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ======================= AUTH ROUTES ======================= //
app.post("/signup", AuthController.createUser);
app.post("/signin", AuthController.userSignIn);

// ======================= GROUP ROUTES ======================= //
app.get("/addGroupData", GroupController.addGroupData);
app.get("/getGroupList", GroupController.getGroupList);
app.get("/searchForEntry", GroupController.searchForEntry);
app.get("/getMembers", GroupController.getMembers);
app.get("/deleteUserFromGroup", GroupController.deleteUserFromGroup);
app.get("/health", (_req, res) => res.json({ ok: true, at: "backend" }));

// ======================= DEBUG ROUTE ======================= //
app.get("/debug/users", async (req, res) => {
  try {
    const User = require("./models/user");
    const users = await User.find({}).limit(10);
    const usersData = users.map(u => {
      const obj = u.toObject();
      return {
        _id: obj._id,
        name: obj.name,
        emailAdress: obj.emailAdress,
        email: obj.email, // in case it's stored as 'email'
        emailAddress: obj.emailAddress, // in case it's stored as 'emailAddress'
        allKeys: Object.keys(obj),
        hasEmailAdress: 'emailAdress' in obj,
        hasEmail: 'email' in obj,
        hasEmailAddress: 'emailAddress' in obj,
      };
    });
    res.json({ 
      totalUsers: users.length,
      users: usersData,
      message: "Check 'allKeys' to see actual field names in database"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ======================= USER ROUTES ======================= //
app.get("/changeUserGroups", UserController.changeUserGroups);
app.get("/userGroupList", UserController.userGroupList);
app.get("/deleteEntry", UserController.deleteEntry);
app.get("/searchForUser", UserController.searchForUser);

// ======================= ADMIN ROUTES ======================= //
app.get("/getAdminGroupList", AdminController.getAdminGroupList);

// ======================= INVITE ROUTES ======================= //
app.get("/getInvites", InviteController.getInvites);
app.get("/makeInvite", InviteController.makeInvite);
app.get("/acceptInvite", InviteController.acceptInvite);

// ======================= AI ROUTES ======================= //
app.get("/addInterviewAnswer", AIController.addInterviewAnswer);
app.get("/chatWithInterviewer", AIController.chatWithInterviewer);
app.get("/chat", AIController.chat);
app.get("/finishInterview", AIController.getSummary);

// ======================= USER DETAILS ======================= //
app.get("/getUserDetails", UserDetails.fetchCurrentUser);

// ======================= SERVER START ======================= //
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
