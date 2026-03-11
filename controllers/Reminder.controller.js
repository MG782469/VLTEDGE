import { Reminder } from '../models/Reminder.js'; // Path adjust kar lena based on your folder structure
import { asynchandler } from "../Asynchandler.js";
import { ApiError } from "../Apierror.js";
import { Apiresponse } from "../Apiresponse.js";
// 1. Create a new Reminder
export const createReminder = asynchandler(async (req, res) => {
    const { productId, reminderDate, message } = req.body;
    // Validation
    if (!productId || !reminderDate) {
        throw new ApiError(400, "Product ID and Reminder Date are required");
    }
    const newReminder = await Reminder.create({
        userId: req.user._id, // Took from Auth Middleware (VerifyJwt)
        productId,
        reminderDate,
        message
    });
    return res.status(201).json(
        new Apiresponse(201, newReminder, "Reminder set successfully")
    );
});
// 2. Get Pending Reminders (Specific to Logged-in User)
export const getPendingReminders = asynchandler(async (req, res) => {
    const reminders = await Reminder.find({
        userId: req.user._id, // Security: Only show my reminders
        notified: false
    }).populate('productId', 'name image expiryDate'); // Populate specific fields to keep it clean

    return res.status(200).json(
        new Apiresponse(200, reminders, "Pending reminders fetched successfully")
    );
});
// 3. Mark Reminder as Notified
export const markAsNotified = asynchandler(async (req, res) => {
    const { id } = req.params;
    // Find and update (Ensure user owns this reminder)
    const updatedReminder = await Reminder.findOneAndUpdate(
        { _id: id, userId: req.user._id }, 
        { $set: { notified: true } },
        { new: true }
    );
    if (!updatedReminder) {
        throw new ApiError(404, "Reminder not found or unauthorized");
    }

    return res.status(200).json(
        new Apiresponse(200, updatedReminder, "Reminder marked as read")
    );
});
// 4. Delete Reminder
export const deleteReminder = asynchandler(async (req, res) => {
    const { id } = req.params;

    const deletedReminder = await Reminder.findOneAndDelete({
        _id: id,
        userId: req.user._id
    });

    if (!deletedReminder) {
        throw new ApiError(404, "Reminder not found or unauthorized");
    }

    return res.status(200).json(
        new Apiresponse(200, {}, "Reminder deleted successfully")
    );
});
