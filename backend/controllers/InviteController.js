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

exports.getInvites = async (req, res) => {
  const { userName } = req.query;
  try {
    const client = await connectMongo();
    const users = client.db("cluster0").collection("users");
    const expectedUser = await users.findOne({ name: userName });
    const invites = await client.db("cluster0").collection("invites")
      .find({ id: { $in: expectedUser.invites } })
      .toArray();
    res.json(invites);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting invites");
  }
};

exports.makeInvite = async (req, res) => {
  const { userName, groupName } = req.query;
  try {
    const client = await connectMongo();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").sort(() => Math.random() - 0.5);
    const newInviteId = chars.join("");
    const users = client.db("cluster0").collection("users");

    await users.updateOne({ name: userName }, { $push: { invites: newInviteId } });
    await client.db("cluster0").collection("invites").insertOne({ id: newInviteId, groupLocation: groupName });

    res.json({ success: true, inviteId: newInviteId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating invite");
  }
};

exports.acceptInvite = async (req, res) =>
{
  const{ inviteId} = req.query;
  try{
    const client = await connectMongo();
    const invites = client.db("cluster0").collection("invites");
    const inviteDetails = await invites.findOne({id: inviteId});
    const inviteGroup = inviteDetails.groupLocation;
    const users = client.db("cluster0").collection("users");
    const groups =await users.findOne({name: req.session.user.fullname, userGroups: inviteGroup});
    if(!groups)
    {
      console.log("Actually called");
      await users.updateOne({name: req.session.user.fullname}, {$push: {userGroups: inviteGroup}});
    }
    console.log(groups);
    await users.updateOne({name: req.session.user.fullname}, {$pull: {invites: inviteId}});
    res.json({success:true});
  }
  catch(err)
  {
    res.status(500).send("Error accepting invite");
  }
}
