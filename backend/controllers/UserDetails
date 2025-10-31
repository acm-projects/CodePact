const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_API_KEY;
let monServer;

async function connectMongo() {
  if (!monServer) {
    monServer = new MongoClient(uri);
    await monServer.connect();
  }
  return monServer;
}

exports.fetchCurrentUser = async (req, res) => {
    if(!req.session.user)
    {
        return  res.status(401).send("User not logged in");
    }
    else{
        return res.json({user: req.session.user,name:req.session.user.fullname});
    }
}