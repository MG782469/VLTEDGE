# 🧾 Expiry Reminder Application

## 🚀 Overview
**ExpiryReminder** is a MERN-stack utility designed to automate inventory expiry tracking and reduce manual monitoring efforts.  
The system allows users to scan product labels, extract expiration dates using OCR, and receive timely notifications before products expire.

This project integrates AI-powered text recognition with scalable background job processing to deliver reliable expiry alerts.

---

## 📌 Project Highlights

- Engineered a **full-stack inventory tracking solution** to automate expiry monitoring and reduce manual oversight.
- Implemented **OCR-based date extraction** using Tesseract.js for scanning product labels.
- Designed **RESTful APIs with robust error handling** to ensure application reliability during server-side failures.
- Built **scalable background job processing** using Redis and BullMQ for scheduled expiry notifications.
- Optimized **UI/UX with React hooks and state management** for faster data updates and responsiveness.

---

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend
- React.js
- JavaScript
- CSS

### Services & Tools
- Tesseract.js – OCR based date extraction
- BullMQ – Background job processing
- Redis – Queue management
- REST APIs – Communication between frontend and backend

---

## ✨ Key Features

### 📦 Inventory Management
- Add and manage product inventory
- Track expiration dates of items
- Store and retrieve product information from database

### 🔍 OCR-Based Date Detection
- Upload or scan product label images
- Extract expiration dates using **Tesseract.js**
- Automatically store detected expiry data

### ⏰ Automated Expiry Notifications
- Schedule background jobs using **BullMQ**
- Queue-based processing with **Redis**
- Notify users before product expiry

### ⚙️ RESTful API Architecture
- Structured API routes
- Error handling using custom middleware
- Modular controller-based architecture

### 💻 Responsive User Interface
- Dynamic UI using React
- Fast state updates with React Hooks
- Clean and responsive design

---

## 📁 Project Structure

```
Expiry_Reminder/
│
├── controllers/        # Business logic
├── models/             # MongoDB schemas
├── routes/             # API routes
├── routers/            # Additional route handlers
├── middlewares/        # Custom middleware
├── public/             # Static files
├── views/              # Templates
├── frontend_eee/       # React frontend
│
├── Apierror.js         # Custom API error handling
├── Apiresponse.js      # API response structure
├── Asynchandler.js     # Async error wrapper
├── connection.js       # Database connection
├── auth.js             # Authentication logic
├── app.js              # Express application setup
├── index.js            # Application entry point
├── api_routes.js       # Main API routes
│
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/MG782469/VLTEDGE.git
cd Expiry_Reminder
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file in the root directory.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_URL=your_redis_url
JWT_SECRET=your_secret_key
```

### 4️⃣ Start the Server

```bash
node index.js
```

or (recommended)

```bash
nodemon index.js
```

### 5️⃣ Open in Browser

```
http://localhost:5000
```

---

## 🔐 Security Features

- Custom API error handling
- Centralized async error wrapper
- Middleware-based request validation
- Secure database connection

---

## 🚀 Future Improvements

- Email / SMS expiry notifications
- Mobile scanning support
- Product barcode scanning
- User authentication system
- Dashboard analytics for inventory insights

---

## 👨‍💻 Author

**Manas Girdhar**  
B.Tech CSE Student  

GitHub:  
https://github.com/MG782469

---

## ⭐ Acknowledgement

This project demonstrates integration of **AI-powered OCR scanning with scalable backend job processing** to create a practical inventory automation tool.
