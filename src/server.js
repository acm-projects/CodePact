require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');


// ======================= CONTROLLERS ======================= //
const AuthController = require('./controllers/AuthController');
const GroupController = require('./controllers/GroupController');
const UserController = require('./controllers/UserController');
const AdminController = require('./controllers/AdminController');
const InviteController = require('./controllers/InviteController.js');
const AIController = require('./controllers/AIController');
const UserDetails = require('./controllers/UserDetails');

const app = express();
const PORT = 3000;


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave :false,
  saveUninitialized : true,
  cookie: {secure:false}
}))

// ======================= MIDDLEWARE ======================= //
app.use(express.json());
app.use(cors());
app.use(express.static("src"));

// ======================= MONGODB CONNECTION ======================= //
mongoose.connect(process.env.MONGO_API_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ======================= AUTH ROUTES ======================= //
app.post('/signup', AuthController.createUser);
app.post('/signin', AuthController.userSignIn);

// ======================= GROUP ROUTES ======================= //
app.get('/addGroupData', GroupController.addGroupData);
app.get('/getGroupList', GroupController.getGroupList);
app.get('/searchForEntry', GroupController.searchForEntry);
app.get('/getMembers', GroupController.getMembers);
app.get('/deleteUserFromGroup', GroupController.deleteUserFromGroup);

// ======================= USER ROUTES ======================= //
app.get('/changeUserGroups', UserController.changeUserGroups);
app.get('/userGroupList', UserController.userGroupList);
app.get('/deleteEntry', UserController.deleteEntry);
app.get('/searchForUser', UserController.searchForUser);

// ======================= ADMIN ROUTES ======================= //
app.get('/getAdminGroupList', AdminController.getAdminGroupList);

// ======================= INVITE ROUTES ======================= //
app.get('/getInvites', InviteController.getInvites);
app.get('/makeInvite', InviteController.makeInvite);
app.get('/acceptInvite', InviteController.acceptInvite);

// ======================= AI ROUTES ======================= //
app.get('/addInterviewAnswer', AIController.addInterviewAnswer);
app.get('/chatWithInterviewer', AIController.chatWithInterviewer);
app.get('/chat', AIController.chat);
app.get('/finishInterview',AIController.getSummary);

// ======================= USER DETAILS ======================= //
app.get('/getUserDetails', UserDetails.fetchCurrentUser);

// ======================= SERVER START ======================= //
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
