import { Product } from '../models/Products.js'; 
import { asynchandler } from "../Asynchandler.js"; 
import { ApiError } from "../Apierror.js";
import { Apiresponse } from "../Apiresponse.js";
import { emailqueue } from "../bullmq/producer.js"; // IMPORT YOUR QUEUE HERE
// Config: How many days before expiry to notify?
const DAYS_BEFORE_EXPIRY = 1;
// 1. Create a new product & Schedule Notification
export const createProduct = asynchandler(async (req, res) => {
    const { name, category, purchaseDate, expiryDate, quantity } = req.body;
    if (!name || !expiryDate){
        throw new ApiError(400, "Name and Expiry Date are required");
    }
    // A. Save to Database
    const newProduct = await Product.create({
        userId: req.user._id,
        name,
       
        purchaseDate,
        expiryDate,
       
    });
    // ---------------------------------------------------------
    // B. BullMQ Logic: Schedule the Delayed Job
    // ---------------------------------------------------------
    // 1. Calculate when to notify (Expiry Date - 2 Days)
    const expiry = new Date(expiryDate);
    const notifyDate = new Date(expiry);
    notifyDate.setDate(notifyDate.getDate() - DAYS_BEFORE_EXPIRY);
    // 2. Calculate Delay (in Milliseconds)
    const delay = notifyDate.getTime() - Date.now();
    // 3. Add to Queue (Only if the date is in the future)
    if (delay > 0) {
        await emailqueue.add("expiry-alert", {
            // Data needed by your Worker
            userEmail: req.user.email, 
            userId: req.user._id,
            subject: `⏰ ${name} is expiring soon - Smart Expiry Tracker`,
            textMessage: `Your ${name} is expiring on ${expiry.toDateString()}.`,
            htmlMessage: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Expiry Alert</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            background-color: #f8f9fa;
            line-height: 1.6;
        }
        
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            padding: 40px 20px;
            text-align: center;
            color: #ffffff;
        }
        
        .header-logo {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .header-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 5px;
            letter-spacing: -0.5px;
        }
        
        .header-subtitle {
            font-size: 14px;
            opacity: 0.9;
            font-weight: 500;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        
        .alert-card {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-left: 4px solid #2563eb;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }
        
        .alert-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        
        .product-name {
            font-size: 22px;
            font-weight: 700;
            color: #1e40af;
            margin-bottom: 8px;
        }
        
        .alert-text {
            font-size: 16px;
            color: #374151;
            margin-bottom: 12px;
            line-height: 1.5;
        }
        
        .expiry-badge {
            display: inline-block;
            background-color: #fca5a5;
            color: #991b1b;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 10px;
        }
        
        .info-section {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
        }
        
        .info-row:last-child {
            border-bottom: none;
        }
        
        .info-label {
            color: #6b7280;
            font-weight: 600;
        }
        
        .info-value {
            color: #1f2937;
            font-weight: 500;
        }
        
        .action-section {
            text-align: center;
            margin: 30px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            color: #ffffff;
            padding: 12px 40px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            margin: 10px 5px;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }
        
        .secondary-button {
            background-color: #e5e7eb;
            color: #374151;
            box-shadow: none;
        }
        
        .secondary-button:hover {
            background-color: #d1d5db;
        }
        
        .tips-section {
            background-color: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 20px;
            border-radius: 8px;
            margin: 25px 0;
        }
        
        .tips-title {
            color: #065f46;
            font-weight: 700;
            margin-bottom: 12px;
            font-size: 16px;
        }
        
        .tips-list {
            list-style: none;
            padding-left: 0;
        }
        
        .tips-list li {
            color: #166534;
            margin: 8px 0;
            padding-left: 24px;
            position: relative;
            font-size: 14px;
        }
        
        .tips-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            font-weight: 700;
            color: #10b981;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 15px;
        }
        
        .app-name {
            font-weight: 700;
            color: #2563eb;
        }
        
        .social-links {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #2563eb;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
        }
        
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 20px 0;
        }
        
        .highlight {
            color: #2563eb;
            font-weight: 600;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .content {
                padding: 25px 20px;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .header-title {
                font-size: 20px;
            }
            
            .product-name {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="header-logo">⏰</div>
            <div class="header-title">Smart Expiry Tracker</div>
            <div class="header-subtitle">Product Expiry Alert</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <!-- Greeting -->
            <div class="greeting">Hello <span class="highlight">${req.user.name || 'User'}</span>,</div>
            
            <!-- Alert Card -->
            <div class="alert-card">
                <div class="alert-icon">⚠️</div>
                <div class="product-name">${name}</div>
                <div class="alert-text">
                    Your <span class="highlight">${name}</span> is expiring soon! 
                </div>
                <div class="expiry-badge">
                    Expires on ${expiry.toDateString()}
                </div>
            </div>
            
            <!-- Details Section -->
            <div class="info-section">
                <div class="info-row">
                    <span class="info-label">📦 Product</span>
                    <span class="info-value">${name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📅 Expiry Date</span>
                    <span class="info-value">${expiry.toDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">⏳ Days Left</span>
                    <span class="info-value"><span class="highlight">${DAYS_BEFORE_EXPIRY} day${DAYS_BEFORE_EXPIRY !== 1 ? 's' : ''}</span></span>
                </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="action-section">
                <a href="http://localhost:5173/products" class="cta-button">View All Products</a>
                <a href="http://localhost:5173/reminders" class="cta-button secondary-button">Set Reminder</a>
            </div>
            
            <!-- Tips Section -->
            <div class="tips-section">
                <div class="tips-title">💡 Quick Tips</div>
                <ul class="tips-list">
                    <li>Use the product before expiry for best results</li>
                    <li>Check storage conditions to extend shelf life</li>
                    <li>Set reminders for upcoming expiries</li>
                    <li>Share products with family to avoid waste</li>
                </ul>
            </div>
            
            <!-- Message -->
            <div class="alert-text" style="text-align: center; margin-top: 30px; color: #9ca3af;">
                Don't let your products go to waste! Check your pantry now and make the most of your purchases.
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">
                You're receiving this because you're using <span class="app-name">Smart Expiry Tracker</span>
            </div>
            <div class="footer-text">
                We help you track product expiries and reduce food waste. Stay organized, stay smart! 🎯
            </div>
            <div class="social-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Unsubscribe</a>
                <a href="#">Settings</a>
            </div>
        </div>
    </div>
</body>
</html>
            `
        }, {
            delay: delay, // ⏳ The Magic Delay
            jobId: `notify-${newProduct._id}`, // 🔑 Custom ID to find/delete it later
            removeOnComplete: true
        });

        console.log(`✅ Notification scheduled for ${name} at ${notifyDate}`);
    } else {
        console.log(`⚠️ ${name} expires too soon (or already expired), no notification set.`);
    }

    return res.status(201).json(
        new Apiresponse(201, newProduct, "Product created & Notification scheduled")
    );
});

// 2. Get all products
export const getProducts = asynchandler(async (req, res) => {
    const {search, sortBy } = req.query;
    let query = { userId: req.user._id };
    
    // if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };

    let sortOptions = { expiryDate: 1 };
    if (sortBy === 'expiry_desc') sortOptions = { expiryDate: -1 };
    else if (sortBy === 'newest') sortOptions = { createdAt: -1 };

    const products = await Product.find(query).sort(sortOptions);

    return res.status(200).json(
        new Apiresponse(200, products, "Products fetched successfully")
    );
});
// 3. Get Single Product
export const getProductById = asynchandler(async (req, res) => {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
    if (!product) throw new ApiError(404, "Product not found");
    
    return res.status(200).json(
        new Apiresponse(200, product, "Product details fetched")
    );
});
// 4. Update Product (Note: If you change expiryDate, ideally you should update the Queue too)
export const updateProduct = asynchandler(async (req, res) => {
    const updates = req.body;
    const product = await Product.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { $set: updates },
        { new: true, runValidators: true }
    );
    if (!product) throw new ApiError(404, "Product not found or unauthorized");

    // TODO: (Optional) If expiryDate changed, remove old job and add new one.
    // For now, we keep it simple.

    return res.status(200).json(
        new Apiresponse(200, product, "Product updated successfully")
    );
});
// 5. Delete Product & Cancel Notification
export const deleteProduct = asynchandler(async (req, res) => {
    // A. Delete from MongoDB
    const product = await Product.findOneAndDelete({ 
        _id: req.params.id, 
        userId: req.user._id 
    });
    if (!product) {
        throw new ApiError(404, "Product not found or unauthorized");
    }
    // ---------------------------------------------------------
    // B. BullMQ Logic: Remove the Scheduled Job
    // ---------------------------------------------------------
    const jobId = `notify-${req.params.id}`; // Same ID used in create
    const job = await emailqueue.getJob(jobId);

    if (job) {
        await job.remove(); // 🗑️ Delete job from Redis
        console.log(`🗑️ Cancelled notification for ${product.name}`);
    } else {
        console.log(`ℹ️ No pending notification found for ${product.name}`);
    }

    return res.status(200).json(
        new Apiresponse(200, {}, "Product deleted & Notification cancelled")
    );
});
// 6. Get Expiring Soon
export const getExpiringSoon = asynchandler(async (req, res) => {
    const days = parseInt(req.query.days) || 7; 
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const products = await Product.find({
        userId: req.user._id,
        expiryDate: { $gte: today, $lte: futureDate }
    }).sort({ expiryDate: 1 });

    return res.status(200).json(
        new Apiresponse(200, {
            count: products.length,
            range: `Next ${days} days`,
            products
        }, "Expiring products fetched")
    );
});