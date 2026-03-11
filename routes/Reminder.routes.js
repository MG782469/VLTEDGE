import { Router } from "express";
import { VerifyJwt } from "../auth.js"; // Ensure path is correct
import { 
    createReminder, 
    getPendingReminders, 
    markAsNotified, 
    deleteReminder 
} from "../controllers/Reminder.controller.js";
const router = Router();
// Apply Auth Middleware to all reminder routes
// This ensures req.user is available in the controller
router.use(VerifyJwt);

// Route: /api/v1/reminders
router.route("/")
    .post(createReminder)       // Create new reminder
    .get(getPendingReminders);  // Get all my pending reminders

// Route: /api/v1/reminders/:id
router.route("/:id")
    .patch(markAsNotified)      // Changed PUT to PATCH (Standard for partial updates)
    .delete(deleteReminder);    // Delete a reminder

export default router;