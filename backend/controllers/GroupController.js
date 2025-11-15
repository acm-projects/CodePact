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

exports.addGroupData = async (req, res) => {
  const { name, members } = req.query;
  
  try {
    const client = await connectMongo();
    const group = client.db("cluster0").collection("groups");
    
    const trimmedName = name?.trim();
    if (!trimmedName) {
      return res.status(400).json({ 
        success: false, 
        message: "Group name is required"
      });
    }
    
    const allGroups = await group.find({}).toArray();
    const existingGroup = allGroups.find(g => 
      g.name && g.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (existingGroup) {
      return res.status(400).json({ 
        success: false, 
        message: "Group already exists",
        debug: {
          requestedName: trimmedName,
          existingGroupName: existingGroup.name,
          nameMatch: trimmedName.toLowerCase() === existingGroup.name?.toLowerCase(),
          allGroupNames: allGroups.map(g => g.name).filter(Boolean)
        }
      });
    }
    
    await group.insertOne({ name: trimmedName, size: members, people: [] });
    const groupList = await group.find({}).toArray();
    
    res.json(groupList);
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Error adding group",
      error: err.message 
    });
  }
};

exports.getGroupList = async (req, res) => {
  try {
    const client = await connectMongo();
    const groupList = await client.db("cluster0").collection("groups").find({}).toArray();
    res.json(groupList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Couldn't get group list");
  }
};

exports.searchForEntry = async (req, res) => {
  const { search } = req.query;
  try {
    const client = await connectMongo();
    const groups = client.db('cluster0').collection('groups');
    const searched = await groups.aggregate([
      {
        $search: {
          index: "fuzzSearch",
          text: { query: search, path: "name", fuzzy: { maxEdits: 2, prefixLength: 1 } }
        }
      },
      { $limit: 10 }
    ]).toArray();
    res.json(searched);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching groups");
  }
};

exports.getMembers = async (req, res) => {
  const { groupName } = req.query;
  try {
    const client = await connectMongo();
    const group = await client.db("cluster0").collection("groups").findOne({ name: groupName });
    if (!group || !group.people) {
      return res.json([]);
    }
    res.json(group.people);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting members");
  }
};

exports.deleteUserFromGroup = async (req, res) => {
  const { groupName, userName } = req.query;
  try {
    const client = await connectMongo();
    const db = client.db("cluster0").collection("groups");
    const group = await db.findOne({ name: groupName });
    const updatedList = group.people.filter(n => n !== userName);
    await db.updateOne({ name: groupName }, { $set: { people: updatedList } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user from group");
  }
};
