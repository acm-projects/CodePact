const { MongoClient } = require('mongodb');
const { isElementAccessExpression } = require('typescript');
var uri = process.env.MONGO_API_KEY;
let monServer;

async function connectMongo() {
  if (!monServer) {
    uri = process.env.MONGO_API_KEY;
    monServer = new MongoClient(uri);
   
    await monServer.connect();
  }
  return monServer;
}

exports.changeUserGroups = async (req, res) => {
  const { name, groupName } = req.query;
  try {
    const client = await connectMongo();
    const users = client.db("cluster0").collection("users");
    console.log(users.name);
    const foundGroup = await users.findOne({ name:req.session.user.fullname, userGroups: groupName });
    if(!foundGroup)
    {
      console.log("Failed to add");
      await users.updateOne({ name:req.session.user.fullname }, { $push: { userGroups: groupName } });
    }


    res.json(await users.findOne({ name }));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user groups");
  }
};

exports.userGroupList = async (req, res) => {
  const { name } = req.query;
  try {
    const client = await connectMongo();
    const users = client.db("cluster0").collection("users");
    res.json(await users.findOne({ name }));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching user groups");
  }
};

exports.deleteEntry = async (req, res) => {
  const { groupName } = req.query;
  try {
    const client = await connectMongo();
    const users = client.db("cluster0").collection("users");
    const specificUser = await users.find({ name: "Tharun" }).toArray();
    const updatedGroups = specificUser[0].userGroups.filter(g => g !== groupName);
    await users.updateOne({ name: "Tharun" }, { $set: { userGroups: updatedGroups } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting entry from user");
  }
};

exports.searchForUser = async (req, res) => {
  const { search } = req.query;
  try {
    const client = await connectMongo();
    const users = client.db('cluster0').collection('users');
    const searched = await users.aggregate([
      {
        $search: {
          index: "userSearch",
          text: { query: search, path: "name", fuzzy: { maxEdits: 2, prefixLength: 1 } }
        }
      },
      { $limit: 10 }
    ]).toArray();
    res.json(searched);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching users");
  }
};
