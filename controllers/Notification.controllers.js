import { Notification } from "../models/Notification.js"; // Adjust path
import { asynchandler } from "../Asynchandler.js";
import { ApiError } from "../Apierror.js";
import { Apiresponse } from "../Apiresponse.js";
// 1. Get All Notifications for the Logged-in User
export const getUserNotifications = asynchandler(async (req, res) => {
    // Fetch notifications sorted by newest first
    const notifications = await Notification.find({ userId: req.user._id })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new Apiresponse(200, notifications, "Notifications fetched successfully")
    );
});
// 2. Get Count of Unread Notifications (For Badge on UI 🔴)
export const getUnreadCount = asynchandler(async (req, res) => {
    const count = await Notification.countDocuments({
        userId: req.user._id,
        read: false
    });
    return res.status(200).json(
        new Apiresponse(200, { unreadCount: count }, "Unread count fetched")
    );
});
// 3. Mark a Single Notification as Read (When user clicks it)
export const markNotificationAsRead = asynchandler(async (req, res) => {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
        { _id: id, userId: req.user._id }, // Ensure ownership
        { $set: { read: true } },
        { new: true }
    );

    if (!notification) {
        throw new ApiError(404, "Notification not found or unauthorized");
    }

    return res.status(200).json(
        new Apiresponse(200, notification, "Notification marked as read")
    );
});

// 4. Mark ALL Notifications as Read (The "Mark all as read" button)
export const markAllAsRead = asynchandler(async (req, res) => {
    const result = await Notification.updateMany(
        { userId: req.user._id, read: false },
        { $set: { read: true } }
    );

    return res.status(200).json(
        new Apiresponse(200, { updatedCount: result.modifiedCount }, "All notifications marked as read")
    );
});

// 5. Delete a Notification
export const deleteNotification = asynchandler(async (req, res) => {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
        _id: id,
        userId: req.user._id
    });

    if (!notification) {
        throw new ApiError(404, "Notification not found or unauthorized");
    }

    return res.status(200).json(
        new Apiresponse(200, {}, "Notification deleted successfully")
    );
});
// 6. Create Notification (Internal Use mainly, but exposed for testing)
// Usually, this is called by your Reminder logic internally, not by the user.
export const createNotification = asynchandler(async (req, res) => {
    const { title, message, type } = req.body;
    if (!title || !message) {
        throw new ApiError(400, "Title and Message are required");
    }
    const notification = await Notification.create({
        userId: req.user._id,
        title,
        message,
        type: type || 'in-app'
    });
    return res.status(201).json(
        new Apiresponse(201, notification, "Notification created")
    );
});