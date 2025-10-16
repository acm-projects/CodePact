require('dotenv').config();


const OpenAI = require('openai');
const express = require('express');


const {MongoClient} = require('mongodb');


const app = express();
const PORT = 3000;
const uri = process.env.MONGO_API_KEY;




app.use(express.json());


const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY
});


async function main()
{
   console.log("Hello World");
   const monServer = new MongoClient(uri);
   await monServer.connect();
   const groups = monServer.db("cluster0").collection("users");
}
main();


app.use(require("cors")());
app.use(express.static("src"));


app.get("/changeUserGroups",async(req,res)=>{
   const{name,groupName} = req.query
   const monServer = new MongoClient(uri);
   try{
       await monServer.connect();
       const groups = monServer.db("cluster0").collection("users");
       await groups.updateOne(
           {name: name},
           { $push: { userGroups:groupName}}
       )
       res.json(await groups.findOne({name:name}));
   }
   catch(err){
       console.error(err);
       res.status(500).send("Error getting data from Mongo");
   }
  
})


app.get("/userGroupList",async(req,res)=>{
   const{name} = req.query
   const monServer = new MongoClient(uri);
   try{
       await monServer.connect();
       const groups = monServer.db("cluster0").collection("users");
       res.json(await groups.findOne({name:name}));
   }
   catch(err){
       console.error(err);
       res.status(500).send("Error getting data from Mongo");
   }
})


app.get("/getGroupList",async(req,res)=>{
   const monServer = new MongoClient(uri);
   console.log("RAN");
   try{
       await monServer.connect();
       const groupList = await monServer.db("cluster0").collection("groups").find({}).toArray();
       res.json(groupList);
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
       await monServer.connect();
       const group = monServer.db("cluster0").collection("groups");
       await group.insertOne({ name: name, size:members });
       const groupList = await monServer.db("cluster0").collection("groups").find({}).toArray();
       res.json(groupList);
   }
   catch(err){
       console.error(err);
   }
   finally
   {
       await monServer.close();
   }
})


app.get("/chat", async(req,res)=>{
   const{text} = req.query;
   try{
       const response = await openai.chat.completions.create({
           model: "gpt-4o-mini",
           messages: [
               { role: "system", content: "You are a helpful Computer Science Interview Assisttant. Keep all responses short and technical" },
               { role: "user", content: text}
           ],
       })
       res.json({reply:response.choices[0].message.content});
   }
   catch(err){
       console.error(err);
   }
})


app.get("/deleteEntry",async(req,res)=>{
   const{groupName} = req.query;
   const monServer = new MongoClient(uri);
   try{
       await monServer.connect();
       const db = monServer.db("cluster0").collection("users");
       const specificUser = await db.find({name:"Tharun"}).toArray();
       const groupLists = specificUser[0].userGroups;
       console.log(groupName);
       console.log(groupLists);
       console.log()
       for(let i = 0;i<groupLists.length;i++)
       {
           if(groupLists[i] == groupName)
           {
               console.log("Happened");
               groupLists.splice(i,1);
               break;
           }
       }


       await db.updateOne(
           {name:"Tharun"},
           {$set:{userGroups:groupLists}}
       );
   }
   catch(err)
   {
       console.error(err);
   }
})


app.get("/searchForEntry",async(req,res)=>{
   const {search} = req.query;
   const monServer = new MongoClient(uri);
   try{
       await monServer.connect();
       const groups = monServer.db('cluster0').collection('groups');


       //Implemented Fuzzy Searching using Atlas Search Index
       const searched = await groups.aggregate([
           {
           $search:
           {
               index:"fuzzSearch",
               text:{
                   query: search,
                   path:"name",
                   fuzzy: {
                       maxEdits: 2,
                       prefixLength: 1
                   }
               }
           }
           },
           { $limit: 10 }
       ]).toArray();
       res.json(searched);
   }
   catch(err)
   {
       console.error(err);
   }
})

//Invite and Searching for users feature
app.get("/getInvites",async(req,res)=>{
    console.log("Ths ran");
    const{userName} = req.query;
    const monServer = new MongoClient(uri);
    try{
        await monServer.connect();
        const expectedUser = await monServer.db("cluster0").collection("users").findOne({name: userName});
        res.json(expectedUser.invites);
    }
    catch(err)
    {
        console.log(err);
    }
})

app.get("/makeInvite",async(req,res)=>{
    console.log("THIS CALLED");
    const{userName} = req.query;
    const monServer = new MongoClient(uri);
    try{
        await monServer.connect();
        let list = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",];
        //Will add shuffle functionLater
        list.sort(() => Math.random() - 0.5);
        let newInviteId = "";
        for(let j = 0;j<list.length;j++)
        {
            newInviteId = newInviteId+list[j];
        }
        const expectedUser = await monServer.db("cluster0").collection("users");
        await expectedUser.updateOne(
            {name: userName},
            { $push: { invites:newInviteId}}
        )

        await monServer.db("cluster0").collection("invites").insertOne({ id: newInviteId});
        console.log("Hppp");
        res.json({ success: true, inviteId: newInviteId });
        
    }
    catch(err)
    {
        console.log(err);
    }
})

app.get("/searchForUser",async(req,res)=>{
    const {search} = req.query;
    const monServer = new MongoClient(uri);
    console.log("HAPPPEPEOPEPPEPEPEP");
    try{
        await monServer.connect();
        const userList = monServer.db('cluster0').collection('users');
        console.log("HELLO");
        //Implemented Fuzzy Searching using Atlas Search Index
        const searched = await userList.aggregate([
            {
            $search:
            {
                index:"userSearch",
                text:{
                    query: search,
                    path:"name",
                    fuzzy: {
                        maxEdits: 2,
                        prefixLength: 1
                    }
                }
            }
            },
            { $limit: 10 }
        ]).toArray();
        console.log(searched);
        res.json(searched);
    }
    catch(err)
    {
        console.error(err);
    }
 })

//Need to show groups that I am admin in. Create a seperate thing in which all groups exist and admin groups can be taken from that
app.get("/getAdminGroupList",async(req,res)=>{
    const{name} = req.query;
    const monServer = new MongoClient(uri);
    console.log("RAN");
    try{
        await monServer.connect();
        const userDetails = await monServer.db("cluster0").collection("users").findOne({name:name});
        const adminGroupList = userDetails.adminGroups;
        console.log(adminGroupList);
        res.json(adminGroupList);
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

 app.get("/getMembers",async(req,res)=>{
    const{groupName} = req.query;
    console.log("Came Here");
    const monServer = new MongoClient(uri);
    try{
        await monServer.connect();
        const groups = await monServer.db("cluster0").collection("groups").findOne({name:groupName});
        const namesList = groups.people;
        console.log(namesList);
        res.json(namesList);
    }
    catch(err){
        console.error(err);
        res.status(500).send("Error getting data from Mongo");
    }
 })
 
 app.get("/deleteUserFromGroup",async(req,res)=>{
    const{groupName,userName} = req.query;
    console.log("HELLO WORLLDDDDDD");
    console.log(userName);
    const monServer = new MongoClient(uri);
    try{
        await monServer.connect();
        const db = monServer.db("cluster0").collection("groups");
        const specificGroup = await db.find({name:groupName}).toArray();
        const nameList = specificGroup[0].people;
        console.log(specificGroup);
        
        for(let i = 0;i<nameList.length;i++)
        {
            if(nameList[i] == userName)
            {
                console.log("Happened");
                nameList.splice(i,1);
                break;
            }
        }
 
        console.log(nameList);
        await db.updateOne(
            {name:groupName},
            {$set:{names:nameList}}
        );
    }
    catch(err)
    {
        console.error(err);
    }
 })

//AI Interviewer thing

app.get("/addInterviewAnswer",async(req,res)=>{
    const{question} = req.query;
    const monServer = new MongoClient(uri);
    try{
        await monServer.connect();
        const interviewAnswers = monServer.db("cluster0").collection("users");
        await interviewAnswers.updateOne(
            {
                name: "Tharun"
            },
            {
                $push: { interviewAnswers: question}
            }
        )
        res.json({ success: true });
    }
    catch(err){
        console.error(err);
    }
    finally
    {
        await monServer.close();
    }
})

//Adding AI Responses

app.get("/chatWithAI", async(req,res)=>{
    const{question} = req.query;
    const monServer = new MongoClient(uri);
    await monServer.connect();
    try{
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful Computer Science Interview Assisttant. Keep all responses short and technical" },
                { role: "user", content: question}
            ],
        })

        const interviewAnswers = monServer.db("cluster0").collection("users");
        await interviewAnswers.updateOne(
            {
                name: "Tharun"
            },
            {
                $push: { interviewAnswers: response.choices[0].message.content}
            }
        )

        res.json({reply:response.choices[0].message.content});
    }
    catch(err){
        console.error(err);
    }
 })



app.listen(PORT, () => {
   console.log(" Server is running at http://localhost:3000");
})
