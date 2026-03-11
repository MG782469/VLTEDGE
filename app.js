import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from "./models/Products.js";
import * as productController from './controllers/Products.controller.js';
import alertsMiddleware from './middlewares/alertMiddleware.js';
import { VerifyJwt } from "./auth.js";
import { getMyProductsPage } from "./controllers/product.js";
import apiRoutes from './api_routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '200kb' }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors({
    origin: "*",
    credentials: true
}))
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

import ocrRoutes from "./routes/ocr.js"
import productRoutes from "./routes/Products.routes.js"
import reminderRoutes from "./routes/Reminder.routes.js"
import userRoutes from "./routes/user.routes.js" 
import notificationRoutes from "./routes/Notifications.routes.js"
// to parse cookies and also  read cookies from incoming requests
import expiryRoutes from "./routes/ocr.js"
import { verify } from 'crypto';

app.use('/api', apiRoutes);
app.get("/login", (req, res) => {
    const token = req.cookies.token; 
    if (token) return res.redirect("/dashboard");
    res.render("login"); 
});

app.get("/signup", (req, res) => {
    res.render("signup"); 
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
})

app.get("/dashboard", async (req, res) => {
    try {
        console.log(req.user);
        const products = await Product.find().sort({ createdAt: -1 });
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + 7);
        const expired = products.filter(p => new Date(p.expiryDate) < today);
        const expiringSoon = products.filter(p => {
            const d = new Date(p.expiryDate);
            return d >= today && d <= futureDate;
        });
        res.render("dashboard", {
            products: products, 
            totalCount: products.length,
            expiredCount: expired.length,
            soonCount: expiringSoon.length,
            totalAlerts: expired.length + expiringSoon.length
        });
    } catch (error) {
        res.render("dashboard", { products: [], totalCount: 0, expiredCount: 0, soonCount: 0, totalAlerts: 0 });
    }
});

app.get("/my-products", VerifyJwt, getMyProductsPage);

app.get("/add-product", (req, res) => {
    res.render("addProduct");
});

app.get("/categories", async (req, res) => {
    try {
        const products = await Product.find();
        
        const groups = {};
        products.forEach(p => {
            const c = p.category || "General";
            groups[c] = (groups[c] || 0) + 1;
        });

        // Bas 'groups' bhejo, 'user' apne aap locals se chala jayega
        res.render("categories", { groups });
    } catch (error) {
        res.render("categories", { groups: {} });
    }
});

app.get("/reminders", async (req, res) => {
    try {
        const products = await Product.find();
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const nextWeek = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

        // Filter products server-side
        const expiringToday = products.filter(p => {
            const exp = new Date(p.expiryDate);
            return exp.toDateString() === todayStart.toDateString();
        });

        const expiringThisWeek = products.filter(p => {
            const exp = new Date(p.expiryDate);
            return exp > todayStart && exp <= nextWeek;
        });

        res.render("reminders", {
            expiringToday,
            expiringThisWeek,
            totalAlerts: expiringToday.length + expiringThisWeek.length
        });
    } catch (error) {
        res.render("reminders", { expiringToday: [], expiringThisWeek: [], totalAlerts: 0 });
    }
});
app.get('/', (req, res) => {
    res.render('scanner');
});

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/reminders", reminderRoutes)
app.use("/api/v1/products", productRoutes)
app.use('/api/expiry', expiryRoutes);
export { app };
