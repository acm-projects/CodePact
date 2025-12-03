require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } = require("@aws-sdk/client-bedrock-agent-runtime");
const http = require("http");            
const { Server } = require("socket.io");     
const cookie = require("cookie");              
const jwt = require("jsonwebtoken"); 
const ALLOWED_ORIGINS = ["http://localhost:5176"];

// ======================= CONTROLLERS ======================= //
const AuthController = require("./controllers/AuthController.js");
const GroupController = require("./controllers/GroupController.js");
const UserController = require("./controllers/UserController.js");
const AdminController = require("./controllers/AdminController.js");
const InviteController = require("./controllers/InviteController.js");
const AIController = require("./controllers/AIController.js");
const UserDetails = require("./controllers/UserDetails.js");
const forumRoutes = require('./routes/forum');
const adzunaRoutes = require('./routes/adzuna');
const notificationRoutes = require('./routes/notificationsRoutes');
const reminderRoutes = require('./routes/remindersRoutes');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');


const app = express();
const server = http.createServer(app);
const PORT = 3000;

const uri = process.env.MONGO_API_KEY;
console.log("Mongo URI:", uri);

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, credentials: true },
  pingTimeout: 20000
});

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
app.get("/findCodeGroup",GroupController.groupJoinCode);
app.get("/getGroupCode",GroupController.getJoinCode);
app.get("/health", (_req, res) => res.json({ ok: true, at: "backend" }));

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

// ======================= ISHMEET+ADI ROUTES ======================= //
app.use('/api/forum', forumRoutes);
app.use('/api/adzuna', adzunaRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/api/reminders', reminderRoutes);


// ======================= SERVER START ======================= //
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// ===================== GROUP CHAT ROUTES (Hopefully idrk) ======================= //
function requireAuth(req, res, next) {
  try {
    const tok = req.cookies?.cp_jwt;
    if (!tok) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const payload = jwt.verify(tok, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
}

// ===== Conversations & Messages =====
app.get('/api/conversations', requireAuth, async (req, res) => {
  const convs = await Conversation.find({ members: req.user.id })
    .select('_id name updatedAt members')
    .populate('members', 'email fullname name')
    .sort({ updatedAt: -1 })
    .lean();

  res.json({ success: true, data: convs });
});


app.get('/api/conversations/:id/messages', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { limit = 25, before } = req.query;

  const member = await Conversation.exists({ _id: id, members: req.user.id });
  if (!member) return res.status(403).json({ success: false, error: 'Forbidden' });

  const q = { conversation: id };
  if (before) q._id = { $lt: before };

  const msgs = await Message.find(q).sort({ _id: -1 }).limit(Number(limit)).lean();
  res.json({ success: true, data: msgs.reverse() });
});

app.post('/api/dev/seed-conv', requireAuth, async (req, res) => {
  try {
    const { name, memberEmails = [] } = req.body || {};
    const emails = Array.from(new Set([req.user.email, ...memberEmails])).map(e =>
      String(e).toLowerCase().trim()
    );

    const users = [];
    for (const email of emails) {
      let u = await User.findOne({ email });
      if (!u) {
        const passwordHash = await bcrypt.hash('dev-placeholder-password', 10); // ✅ satisfy schema
        u = await User.create({
          email,
          fullname: email.split('@')[0],
          passwordHash,
        });
      }
      users.push(u);
    }

    const conv = await Conversation.create({
      name: name || 'New Conversation',
      members: users.map(u => u._id),
      lastMessageAt: new Date()
    });

    res.json({ success: true, data: conv });
  } catch (e) {
    console.error('seed-conv error:', e);
    res.status(500).json({ success: false, error: e.message || 'internal error' });
  }
});

app.post('/api/conversations/:id/add-member', requireAuth, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ success: false, error: 'email required' });
    }

    const normalized = String(email).toLowerCase().trim();

    // Only a member of the conversation can add others
    const conv = await Conversation.findOne({
      _id: req.params.id,
      members: req.user.id,
    });

    if (!conv) {
      return res.status(404).json({ success: false, error: 'Conversation not found' });
    }

    let user = await User.findOne({ email: normalized });

    // If user doesn't exist yet, create one with a dev placeholder password
    if (!user) {
      const passwordHash = await bcrypt.hash('dev-placeholder-password', 10);
      user = await User.create({
        email: normalized,
        fullname: normalized.split('@')[0],
        passwordHash,
      });
    }

    // Add to conversation members if not already present
    if (!conv.members.some((m) => m.toString() === user._id.toString())) {
      conv.members.push(user._id);
      await conv.save();
    }

    await conv.populate('members', 'email fullname name');

    res.json({
      success: true,
      data: conv,
      // Helpful info for you while testing:
      note: 'If this email did not have an account, it was created with password "dev-placeholder-password".',
    });
  } catch (e) {
    console.error('add-member error:', e);
    res.status(500).json({ success: false, error: e.message || 'internal error' });
  }
});





// ====================== SOCKET.IO ======================= //
// Authenticate socket connection


io.use((socket, next) => {
  try {
    const parsed = cookie.parse(socket.handshake.headers?.cookie || '');
    const tok = parsed.cp_jwt;
    //console.log(tok);
    if (!tok) return next(new Error('Unauthorized'));
    const payload = jwt.verify(tok, process.env.JWT_SECRET);
    socket.user = { _id: payload.id, name: payload.name };
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  console.log('Socket connected!', socket.id);
});

io.on('connect_error', (err) => {
  console.log('Connection error:', err);
});

const rooms = {};
io.on('connection', (socket) => {
  const userId = socket.user._id;
  console.log("Connection MADE");
  //New routes for interview part
  socket.on("nextQuestion",({roomId,question}) =>
  {
    console.log("NEW QUESTION ASKED");
    if(rooms[roomId] && rooms[roomId].interviewerId == userId)
      {
        rooms[roomId].currentQuestion = question;
        io.to(roomId).emit("newQuestion", {question});
        console.log("NEW QUESTION SENT: "+question);
      }
      io.to(roomId).emit("ask_next_question", { question });
  });

  socket.on("connect_error", (err) => {
    console.log("Socket connection error:", err.message);
  });

  socket.on("joinRoom", ({roomId,role}) => {
    if(!rooms[roomId])
    {
      rooms[roomId] = {messages:[],currentQuestion:null,interviewerId:null,intervieweeId:null};
    }

    if(role == "interviewer")
    {
      rooms[roomId].interviewerId = userId;
    }

    if(role == "interviewee")
    {
      rooms[roomId].intervieweeId = userId;
    }
    socket.join(roomId);
    console.log("USER JOINED ROOM: "+roomId+" AS "+role);
  });



  socket.on("endInterview", ({roomId}) => {
    io.to(roomId).emit("interviewEnded", {});
    delete rooms[roomId];
    console.log("ROOM HAS BEEN DELETED");
  })

  // Join a conversation room
  socket.on('conversation:join', async ({ conversationId }) => {
    const member = await Conversation.exists({ _id: conversationId, members: userId });
    if (member) socket.join(`conv:${conversationId}`);
  });

  // Send a message
  socket.on('message:send', async ({ conversationId, text, attachments = [] }, ack) => {
    try {
      const member = await Conversation.exists({ _id: conversationId, members: userId });
      if (!member) throw new Error('Forbidden');

      const msg = await Message.create({
        conversation: conversationId,
        sender: userId,
        text,
        attachments
      });

      await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });

      io.to(`conv:${conversationId}`).emit('message:new', {
        _id: msg._id.toString(),
        conversation: conversationId,
        sender: userId,
        text,
        attachments,
        createdAt: msg.createdAt
      });

      ack?.({ ok: true, messageId: msg._id.toString() });
    } catch (e) {
      ack?.({ ok: false, error: e.message });
    }
  });

  // Typing indicator
  socket.on('typing', ({ conversationId, isTyping }) => {
    socket.to(`conv:${conversationId}`).emit('typing', { userId, isTyping, conversationId });
  });
});


//AWS Stuff

const bedrockClient = new BedrockAgentRuntimeClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
})

const knowledgeBaseId = "ZCUR9ZUVO9"
const modelARN = "arn:aws:bedrock:us-east-2:898919247843:default-prompt-router/anthropic.claude:1";

app.get('/chat2', async (req,res) => {
  const { message } = req.query;
  console.log("ROUTE HIT WITH MESSAGE!");
  try{

    const command = new RetrieveAndGenerateCommand({
      input: { 
        text: (message+": Keep all answers concise")
      },
      retrieveAndGenerateConfiguration: {
        type: "KNOWLEDGE_BASE",
        knowledgeBaseConfiguration: {
          knowledgeBaseId: knowledgeBaseId,
          modelArn: modelARN
        }
      }
    });

    const response = await bedrockClient.send(command);

    const answer = response.output.text;
    const citations = response.retrievedItems || [];
    console.log(citations);
    //console.log('Generated answer:', answer);

    res.json({ answer:answer});
  }
  catch(error)
  {
    console.error("Error during Bedrock chat:", error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
  );
