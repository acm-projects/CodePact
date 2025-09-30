require('dotenv').config();

const express= require('express');
const {MongoClient} = require('mongodb');

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://tharunsevvel_db_user:tha123DAT%21@Cluster0.oo5qolc.mongodb.net/myDatabase?retryWrites=true&w=majority";

async function main()
{
    const monServer = new MongoClient(uri);
    await monServer.connect();
    const groups = monServer.db("cluster0").collection("groups");
    await groups.insertOne({ name: "Leetcode Champs", type: "Competitive Programming" });
}
main();

app.get("/", ( req,res) => {
    res.end("Backend Sever is Running");
});

app.get("/data", async(req,res) => {
    const monServer = new MongoClient(uri);

    try{
        console.log("Attemtping to connect to mongo database");
        await monServer.connect();
        console.log("Connected to mongo database");

        console.log("Adding new data");
        const users = monServer.db("cluster0").collection("users");
        await users.insertOne({ name: "Tharun", age: 18 });
        console.log("Added Data");

        const userList = await monServer.db("cluster0").collection("users").find({}).toArray();
        res.json(userList);
        console.log("Returned Data");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error getting data from Mongo");
    }
    finally
    {
        await monServer.close();
    }
})

app.get("/getGroupList",async(req,res)=>{
    const monServer = new MongoClient(uri);
    try{
        console.log("Attemtping to connect to mongo database");
        await monServer.connect();
        console.log("Connected to mongo database");

        console.log("Getting new data");
        const groupList = await monServer.db("cluster0").collection("groups").find({}).toArray();
        console.log("Recieved new data");

        res.json(groupList);
        console.log("Data sent");
    }
    catch(err)
    {
        console.error(err);
        res.status(500).send("Couldn't get group List");
    }
    finally
    {
        await monServer.close();
    }
})

app.get("/addGroupData",async(req,res)=>{
    const{ name, members} = req.query;
    const monServer = new MongoClient(uri);

    try{
        console.log("Attemtping to connect to mongo database");
        await monServer.connect();
        console.log("Connected to mongo database");

        console.log("Adding new data");
        const group = monServer.db("cluster0").collection("groups");
        await users.insertOne({ name: name, size:members });
        console.log("Added Data");

        const groupList = await monServer.db("cluster0").collection("groups").find({}).toArray();
        res.json(groupList);
        console.log("Returned Data");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error getting data from Mongo");
    }
    finally
    {
        await monServer.close();
    }
})

app.get("/searchForGroup",async(req,res)=>{
    const{name} = req.query;
    const monServer = new MongoClient(uri);

    try{
        console.log("Attemtping to connect to mongo database");
        await monServer.connect();
        console.log("Connected to mongo database");

        console.log("Looking for matching data");
        const groups = await monServer.db("cluster0").collection("groups").find({name:name}).toArray();
         if(!groups)
         {
            console.log("No Data Found");
         }
         else
         {

         }

        const groupList = await monServer.db("cluster0").collection("groups").find({}).toArray();
        res.json(groupList);
        console.log("Returned Data");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error getting data from Mongo");
    }
    finally
    {
        await monServer.close();
    }
})

app.listen(PORT, () => {
    console.log(" Server is running at http://localhost:3000");
})