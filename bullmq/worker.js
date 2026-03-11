import { Worker } from "bullmq";
import { connection } from "./redisdb.js"; // Path check kar lena
import nodemailer from "nodemailer";
import { Notification } from "../models/Notification.js"; // Schema import zaroori hai
const worker = new Worker("email-queue", async (job) => {

    // 1. Job se Data Nikalo
    const { userEmail, userId, subject, htmlMessage, textMessage } = job.data;

    console.log(`🚀 Processing job ${job.id} for ${userEmail}`);

    // 2. Transporter Setup
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "luckyali7666@gmail.com", // .env se lo
            pass: "cevrgwxppqypfbpm"
        }
    });
    // 3. Mail Options (Dynamic)
    let mailOptions = {
        from: `"Pantry App 🍎" <${process.env.MAIL_USER}>`,
        to: userEmail,      // Job se aaya hua email
        subject: subject,   // Job se aaya hua subject
        html: htmlMessage,  // Job se aaya hua message
    };

    try {
        // 4. Send Email
        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent: " + info.messageId);

        // 5. Save to Database (Notification History)
        // Taaki user app khole toh bell icon mein dikhe
        await Notification.create({
            userId: userId,
            type: 'email',
            title: subject,
            message: textMessage || "You have a new alert.",
            read: false
        });

        console.log("📝 Notification saved to DB");

    } catch (error) {
        console.error("❌ Error sending email: " + error.message);
        throw error; // Error throw karna zaroori hai taaki BullMQ retry kare
    }
}, 
{
    connection,
    concurrency: 5 // Ek saath 5 emails
});

// Event Listeners
worker.on("completed", (job) => {
    console.log(`🎉 Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
    console.log(`💀 Job ${job.id} failed: ${err.message}`);
});

export { worker };