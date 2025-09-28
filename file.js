require('dotenv').config();

const express= require('express');
const {MongoClient} = require('mongodb');

const app = express();
const PORT = 3000;
const uri = "mongodb+srv://tharunsevvel_db_user:tha123DAT%21@Cluster0.oo5qolc.mongodb.net/myDatabase?retryWrites=true&w=majority";

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

app.listen(PORT, () => {
    console.log(" Server is running at http://localhost:3000");
})