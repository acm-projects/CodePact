const express = require('express');
const Reminder = require('../models/reminder');
const Notification = require('../models/notification');
const router = express.Router();

// Create reminder
router.post('/', async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();

    // Auto-create a notification for the reminder
    await Notification.create({
      userId: reminder.userId,
      type: 'reminder',
      title: `Reminder: ${reminder.title}`,
      message: `Due on ${new Date(reminder.dueDate).toLocaleDateString()}`
    });

    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// Get all reminders for a user
router.get('/:userId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId })
      .sort({ dueDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching reminders' });
  }
});

// Mark reminder complete
router.patch('/:id/complete', async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { completed: true },
      { new: true }
    );

    // Optional: notify squad teammates
    if (reminder.squadId) {
      await Notification.create({
        userId: reminder.userId,
        type: 'squad',
        title: 'Squad Update',
        message: `A teammate completed "${reminder.title}"!`
      });
    }

    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete reminder' });
  }
});

module.exports = router;
