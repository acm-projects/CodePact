
const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const { MongoClient } = require("mongodb");
const OpenAI = require("openai");


console.log("[AIController] CWD:", process.cwd());
console.log("[AIController] OPENAI key set?", !!process.env.OPENAI_API_KEY);


const uri = process.env.MONGO_API_KEY;
let monServer;

async function connectMongo() {
  if (!monServer) {
    monServer = new MongoClient(uri);
    await monServer.connect();
    console.log("[MongoDB] Connected successfully");
  }
  return monServer;
}


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


exports.addInterviewAnswer = async (req, res) => {
  console.log("Did Something");
  const { question } = req.query;
  try {
    const client = await connectMongo();
    const users = client.db("cluster0").collection("users");
    await users.updateOne(
      { name: req.session.user.fullname },
      { $push: { interviewAnswers: question } }
    );
    const debugOutput = await users.findOne({ name: "Tharun" });
    console.log(debugOutput.interviewAnswers);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding interview answer");
  }
};


exports.chat = async (req, res) => {
  const { text } = req.query;
  console.log(text);
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful Computer Science Interview Assistant. Keep all responses short and technical.",
        },
        { role: "user", content: text },
      ],
    });
    
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error chatting with AI");
  }
};


exports.chatWithInterviewer = async (req, res) => {
  const { text } = req.query;
  try {
    const client = await connectMongo();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a Computer Science Interviewer. Ask questions and give feedback. Keep all responses short and simple.",
        },
        { role: "user", content: text },
      ],
    });

    const users = client.db("cluster0").collection("users");
    await users.updateOne(
      { name: req.session.user.fullname },
      { $push: { interviewAnswers: response.choices[0].message.content } }
    );
    const debugOutput = await users.findOne({ name: "Tharun" });
    console.log(debugOutput.interviewAnswers);
    console.log("AI RAN");

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error chatting with AI");
  }
};


exports.getSummary = async (req, res) => {
  try {
    const client = await connectMongo();
    const users = client.db("cluster0").collection("users");
    const userDetails = await users.findOne({
      name: req.session.user.fullname,
    });
    const interviewAnswers = userDetails.interviewAnswers || [];

    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that summarizes interview answers. Keep answers short and concise.",
        },
        {
          role: "user",
          content: `Summarize the following interview and provide feedback:\n\n${interviewAnswers.join(
            "\n\n"
          )}`,
        },
      ],
    });

    await users.updateOne(
      { name: req.session.user.fullname },
      { $set: { interviewAnswers: [] } }
    );

    console.log(summaryResponse.choices[0].message.content);
    console.log(userDetails.interviewAnswers);

    res.json({ summary: summaryResponse.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting summary");
  }
};
