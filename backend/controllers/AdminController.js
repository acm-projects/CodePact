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

exports.getAdminGroupList = async (req, res) => {
  const { name } = req.query;
  try {
    const client = await connectMongo();
    const users = client.db("cluster0").collection("users");
    const userDetails = await users.findOne({ name });
    res.json(userDetails.adminGroups);
  } catch (err) {
    console.error(err);
    res.status(500).send("Couldn't get admin group list");
  }
};
