# 🌍 WhatsUp - Language Exchange Platform

**WhatsUp** is a real-time language exchange platform designed to connect people from around the world. Whether you're learning a new language or looking to help someone practice yours, WhatsUp offers a seamless chat and video experience to facilitate communication and cultural exchange.

---


## 🚀 Features

- 💬 Real-time messaging powered by **Stream Chat API**
- 📹 Video call support with direct call links
- 🔐 Secure JWT-based user authentication
- 📧 Email verification & notifications via **Nodemailer**
- 🤖 AI Chat assistant powered by **Gemini API**
- 💳 Razorpay payment integration for premium features
- 🎨 Elegant UI using **Tailwind CSS** & **DaisyUI**
- ⚡ Fast and scalable state management using **Zustand**

---

## 🛠️ Tech Stack

### **Frontend**
- React.js
- Vite
- Tailwind CSS + DaisyUI
- Zustand
- Stream Chat React SDK

### **Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer
- Razorpay Integration
- Gemini API for AI chat
---

## 📦 Installation Guide

### 📁 Clone the Repository

```bash
git clone https://github.com/swarajjaiswal/WhatsUp.git
cd whatsup
cd frontend
npm install

# Create a .env file in the frontend/
VITE_STREAM_API_KEY=your_stream_api_key
VITE_RAZORPAY_KEY=your_razorpay_key

cd ../backend
npm install

# Create a .env file in the backend/
PORT=your_port
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET_KEY=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
NODE_MAILER_USER=your_email@example.com
NODE_MAILER_PASS=your_email_password
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_ID=your_razorpay_id
RAZORPAY_SECRET=your_razorpay_secret
NEXA_EMAIL=your_ai_email_id
NEXA_PASSWORD=your_ai_password


# Start the backend server
cd backend
npm start

# Start the frontend server
cd ../frontend
npm run dev
