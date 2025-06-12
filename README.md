# 🌍 WhatsUp - Language Exchange Platform

**WhatsUp** is a real-time language exchange platform designed to connect people from around the world. Whether you're learning a new language or looking to help someone practice yours, WhatsUp offers a seamless chat and video experience to facilitate communication and cultural exchange.

---

## 🚀 Features

- 💬 Real-time messaging powered by **Stream Chat API**
- 📹 Video call support with direct call links
- 🔐 Secure JWT-based user authentication
- 📨 Email verification & notifications via **Nodemailer**
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
- Nodemailer for email services

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

cd ../backend
npm install

# Create a .env file in the backend/
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_SECRET=your_stream_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Start the backend server
cd backend
npm start

# Start the frontend server
cd ../frontend
npm run dev
