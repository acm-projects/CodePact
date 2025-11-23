const { MongoClient } = require('mongodb');
var uri = process.env.MONGO_API_KEY;
let monServer;

async function connectMongo() {
  if (!monServer) {
    console.log(process.env.MONGO_API_KEY);
    uri = process.env.MONGO_API_KEY;


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
    
    const usersDb = client.db("cluster0").collection("users");

    let codeLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    codeLetters = codeLetters.sort(() => Math.random() - 0.5);
    const groupCode = codeLetters.join("").substring(0, 5);
    await group.insertOne({ name: trimmedName, size: members, people: [] ,code:groupCode});

    await usersDb.$set({ emailAdress:req.session.user.emailAddress }, { $push: { adminGroups: trimmedName } }, {$push:{userGroups:trimmedName}});
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

exports.groupJoinCode = async (req, res) => {
  const {groupCode} = req.query;
  try{
    const client = await connectMongo();
    const groups = client.db("cluster0").collection("groups");
    const users = client.db("cluster0").collection("users");
    const groupDetails = await groups.findOne({code:groupCode});
    if(!groupDetails)
    {
      return res.status(404).json({success:false, message: "Group not found"});
    }
    const userDetails = await users.findOne({name:req.session.user.fullname});
    if(userDetails.userGroups && userDetails.userGroups.includes(groupCode))
    {
      return res.status(400).json({success:false, message: "User already in group"});
    }
    else{
      await users.$set({name:req.session.user.fullname}, {$push: {userGroups: groupDetails.name}});
      res.json({success:true, message: "Joined group successfully" });
    }
  }
  catch(err)
  {
    console.error(err);
    res.status(500).send("Error joining group with code");
  }
}
