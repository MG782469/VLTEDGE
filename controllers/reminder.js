const Reminder = require('./reminder.model');

exports.createReminder = async (req, res) => {
  try {
    const reminder = new Reminder(req.body);
    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find()
      .populate('userId', 'name email')
      .populate('productId', 'name price');
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('productId', 'name price');
    if (!reminder) return res.status(404).json({ error: 'Reminder not found' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const updated = await Reminder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Reminder not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const deleted = await Reminder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Reminder not found' });
    res.json({ message: 'Reminder deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRemindersByUser = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId })
      .populate('productId', 'name price');
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDueReminders = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reminders = await Reminder.find({
      reminderDate: { $gte: today, $lt: tomorrow },
      notified: false
    }).populate('userId', 'name email')
      .populate('productId', 'name price');

    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
