import mongoose from 'mongoose';
const ReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  reminderDate: { type: Date, required: true },
  message: String,
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export const Reminder = mongoose.model('Reminder', ReminderSchema);