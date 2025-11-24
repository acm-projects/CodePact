const express = require("express");
const router = express.Router();
const Reminder = require("../models/Reminder");

// ✅ Create a reminder
router.post("/", async (req, res) => {
  try {
    const { userId, squadId, title, message, dueDate } = req.body;
    if (!userId || !title || !dueDate) {
      return res.status(400).json({ error: "userId, title, and dueDate are required" });
    }

    const reminder = new Reminder({
      userId,
      squadId,
      title,
      message,
      dueDate,
    });

    await reminder.save();
    return res.status(201).json({ message: "Reminder created", reminder });
  } catch (err) {
    console.error("Create reminder error:", err);
    return res.status(500).json({ error: "Failed to create reminder" });
  }
});

// ✅ Get reminders for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId }).sort({ dueDate: 1 });
    return res.json({ reminders });
  } catch (err) {
    console.error("Get reminders error:", err);
    return res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

// ✅ Mark a reminder as completed
router.put("/:id/complete", async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ error: "Reminder not found" });
    return res.json({ message: "Reminder marked complete", reminder });
  } catch (err) {
    console.error("Complete reminder error:", err);
    return res.status(500).json({ error: "Failed to complete reminder" });
  }
});

// ✅ Delete a reminder
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Reminder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Reminder not found" });
    return res.json({ message: "Reminder deleted" });
  } catch (err) {
    console.error("Delete reminder error:", err);
    return res.status(500).json({ error: "Failed to delete reminder" });
  }
});

module.exports = router;