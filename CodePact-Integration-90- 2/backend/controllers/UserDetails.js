const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_API_KEY;
let monServer;

async function connectMongo() {
  if (!monServer) {
    monServer = new MongoClient(uri);
    await monServer.connect();
  }
  return monServer;
}
console.log("Hello Workd");
exports.fetchCurrentUser = async (req, res) => {
  console.log("Goat user");

  if (!req.session.user) {
    return res.status(401).send("User not logged in");
  } else {
    try {
      // Get full user data from database including groups
      const client = await connectMongo();
      const users = client.db("cluster0").collection("users");
      
      // Find user by emailAddress or email
      const dbUser = await users.findOne({ 
        $or: [
          { emailAddress: req.session.user.emailAddress },
          { email: req.session.user.emailAddress }
        ]
      });
      
      if (dbUser) {
        return res.json({
          user: req.session.user,
          name: dbUser.name || req.session.user.name,
          emailAddress: dbUser.emailAddress || dbUser.email || req.session.user.emailAddress,
          fullname: dbUser.name || dbUser.fullname || req.session.user.name,
          userGroups: dbUser.userGroups || [],
          adminGroups: dbUser.adminGroups || [],
        });
      } else {
        // Fallback to session data if not found in DB
        return res.json({
          user: req.session.user,
          name: req.session.user.name,
          emailAddress: req.session.user.emailAddress,
          fullname: req.session.user.name,
          userGroups: [],
          adminGroups: [],
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Fallback to session data on error
      return res.json({
        user: req.session.user,
        name: req.session.user.name,
        emailAddress: req.session.user.emailAddress,
        fullname: req.session.user.name,
        userGroups: [],
        adminGroups: [],
      });
    }
  }
};
