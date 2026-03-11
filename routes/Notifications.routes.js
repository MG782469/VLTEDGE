import { Router } from "express";
import { VerifyJwt } from "../auth.js";
import { 
    getUserNotifications, 
    getUnreadCount, 
    markNotificationAsRead, 
    markAllAsRead, 
    deleteNotification,
    createNotification 
} from "../controllers/Notification.controllers.js";
const router = Router();
// Secure all routes
router.use(VerifyJwt);
router.route("/")
    .get(getUserNotifications)   // Get list
    .post(createNotification);   // Create (Optional/Testing)
router.route("/unread-count")
    .get(getUnreadCount);        // Get simple count (e.g., "5")
router.route("/mark-all-read")
    .patch(markAllAsRead);       // Mark all read
router.route("/:id")
    .patch(markNotificationAsRead) // Mark one read
    .delete(deleteNotification);   // Delete one
export default router;