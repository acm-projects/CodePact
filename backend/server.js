// ===== Dev helper (hash) =====
const bcrypt = require('bcryptjs');

// ===== Core & Env =====
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
const { Server } = require('socket.io');

// ===== Models =====
const User = require('./models/User');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

// ===== Routes =====
const leetcodeRoutes = require('./routes/leetcode');
const userRouter = require('./routes/user');
const forumRoutes = require('./routes/forum');
const adzunaRoutes = require('./routes/adzuna');
const notificationRoutes = require('./routes/notificationsRoutes');
const reminderRoutes = require('./routes/remindersRoutes');

// ===== Express & Socket.io setup =====
const app = express();
const server = http.createServer(app);

// ===== Config =====
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:3000';

if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET missing in .env');
  process.exit(1);
}
if (!mongoURI) {
  console.error('❌ MONGO_URI missing in .env');
  process.exit(1);
}

const ALLOWED_ORIGINS = CLIENT_ORIGIN.split(',').map(s => s.trim());

// ===== Middleware =====
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== Health check =====
app.get('/health', (_req, res) => res.json({ ok: true }));

// ===== Routes =====
app.use('/api', leetcodeRoutes);
app.use('/api', userRouter);
app.use('/api/forum', forumRoutes);
app.use('/api/adzuna', adzunaRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reminders', reminderRoutes);

// ===== Auth Helpers =====
function signJwt(user) {
  return jwt.sign(
    { id: user._id, name: user.fullname || user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function setAuthCookie(res, token) {
  const sameSite = CLIENT_ORIGIN.includes('localhost') ? 'lax' : 'none';
  const secure = sameSite === 'none';
  res.cookie('cp_jwt', token, {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

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

// ===== Dev Auth Endpoints =====
app.post('/api/auth/dev-login', async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ success: false, error: 'email required' });

    const normalized = String(email).toLowerCase().trim();

    let user = await User.findOne({ email: normalized });
    if (!user) {
      const passwordHash = await bcrypt.hash('dev-placeholder-password', 10); // ✅ satisfy schema
      user = await User.create({
        email: normalized,
        fullname: name || normalized.split('@')[0],
        passwordHash,
      });
    }

    const token = signJwt(user);
    setAuthCookie(res, token);
    res.json({
      success: true,
      data: { _id: user._id, email: user.email, name: user.fullname || user.name }
    });
  } catch (e) {
    console.error('dev-login error:', e);
    res.status(500).json({ success: false, error: e.message || 'internal error' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });
  res.json({
    success: true,
    data: { _id: user._id, email: user.email, name: user.fullname || user.name }
  });
});

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


app.post('/api/auth/logout', (req, res) => {
  res.cookie('cp_jwt', '', {
    httpOnly: true,
    secure: false,              // true in production HTTPS
    sameSite: 'lax',
    expires: new Date(0)
  });
  return res.json({ success: true });
});


// ===== Socket.IO Setup =====
const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, credentials: true },
  pingTimeout: 20000
});

io.use((socket, next) => {
  try {
    const parsed = cookie.parse(socket.handshake.headers?.cookie || '');
    const tok = parsed.cp_jwt;
    if (!tok) return next(new Error('Unauthorized'));
    const payload = jwt.verify(tok, process.env.JWT_SECRET);
    socket.user = { _id: payload.id, name: payload.name };
    next();
  } catch {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user._id;

  socket.on('conversation:join', async ({ conversationId }) => {
    const member = await Conversation.exists({ _id: conversationId, members: userId });
    if (member) socket.join(`conv:${conversationId}`);
  });

  socket.on('message:send', async ({ conversationId, text, tempId, attachments = [] }, ack) => {
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
        createdAt: msg.createdAt,
        tempId
      });

      ack?.({ ok: true, messageId: msg._id.toString() });
    } catch (e) {
      ack?.({ ok: false, error: e.message });
    }
  });

  socket.on('typing', ({ conversationId, isTyping }) => {
    socket.to(`conv:${conversationId}`).emit('typing', { userId, isTyping, conversationId });
  });
});

// ===== Start Server =====
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log('MongoDB connected');

    try {
      const db = mongoose.connection.db;
      const coll = db.collection('messages');
      const indexes = await coll.indexes();
      const bad = indexes.find(ix => ix.unique === true && ix.key && ix.key.clientId === 1);
      if (bad) {
        await coll.dropIndex(bad.name);
        console.log('Dropped unique index:', bad.name);
        await coll.createIndex({ clientId: 1 });
        console.log('Created non-unique index on { clientId: 1 }');
      } else {
        console.log('No unique clientId index found. Nothing to drop.');
      }
    } catch (e) {
      console.log('Index check error:', e.message);
    }

    server.listen(PORT, '127.0.0.1', () => {
      console.log(`HTTP listening on http://localhost:${PORT}`);
      console.log(`Client origin(s): ${ALLOWED_ORIGINS.join(', ')}`);
    });
  })
  .catch(err => {
    console.error('MongoDB error:', err);
    process.exit(1);
  });
