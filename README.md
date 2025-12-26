# SynChat – Real-Time MERN Chat Application

SynChat is a full-stack real-time chat application built using the MERN stack.  
It supports secure one-to-one and group conversations with instant message delivery using WebSockets.  
The application integrates Gemini AI to provide contextual AI-assisted chat responses.

This project demonstrates real-world full-stack development practices including authentication, real-time communication, role-based access control, and AI integration.

---

## Features

- JWT-based user authentication (login and registration)
- Real-time one-to-one messaging
- Group chat creation and management
- Admin-only group controls (rename group, add/remove users)
- Real-time communication using Socket.IO
- AI-assisted chat responses using Gemini AI
- Responsive UI built with Tailwind CSS
- Secure backend APIs with protected routes

---

## Tech Stack

### Frontend

- React
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB

### Real-Time

- Socket.IO

### Authentication

- JSON Web Tokens (JWT)

### AI Integration

- Gemini AI API

---

## Project Structure

```
SynChat/
│
├── backend/
│ ├── controllers/
│ │ ├── ai-controller.js
│ │ ├── chat-controller.js
│ │ ├── message-controller.js
│ │ └── user-controller.js
│ │
│ ├── db/
│ │ └── db.js
│ │
│ ├── middlewares/
│ │ ├── auth-middleware.js
│ │ └── error-middleware.js
│ │
│ ├── model/
│ │ ├── chat-model.js
│ │ ├── message-model.js
│ │ └── user-model.js
│ │
│ ├── routes/
│ │ ├── ai-routes.js
│ │ ├── chat-routes.js
│ │ ├── message-routes.js
│ │ └── user-routes.js
│ │
│ ├── service/
│ │ └── ai-service.js
│ │
│ ├── server.js
│ ├── .env
│ ├── package.json
│ └── package-lock.json
│
├── frontend/
│ ├── public/
│ │
│ ├── src/
│ │ ├── auth/
│ │ │ ├── Login.jsx
│ │ │ └── Register.jsx
│ │ │
│ │ ├── components/
│ │ │ ├── GroupChatModal.jsx
│ │ │ ├── ProfileModal.jsx
│ │ │ ├── SideDrawer.jsx
│ │ │ ├── UpdateGroupChatModal.jsx
│ │ │ ├── UserAvatar/
│ │ │ ├── UserBadgeItem.jsx
│ │ │ ├── UserListItem.jsx
│ │ │ ├── ChatBox.jsx
│ │ │ ├── ChatLoading.jsx
│ │ │ ├── MyChats.jsx
│ │ │ ├── ScrollableChat.jsx
│ │ │ └── SingleChat.jsx
│ │ │
│ │ ├── config/
│ │ ├── context/
│ │ │ └── chatProvider.jsx
│ │ │
│ │ ├── pages/
│ │ │ ├── ChatPage.jsx
│ │ │ └── Home.jsx
│ │ │
│ │ ├── service/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ │
│ ├── .env
│ ├── package.json
│ └── package-lock.json
│
└── README.md
```

---

## Installation and Setup

### Frontend Environment Variables

Create a .env file inside the frontend directory and add the following variables:

```bash
VITE_APP_URL=http://localhost:3000
CLOUDINARY_URL=your_cloudinary_upload_url
```

### Backend Environment Variables

Create a `.env` file inside the `backend` directory and add the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Gemini AI API key

---

### Clone Repository

```bash
git clone https://github.com/r0hanr02/SynChat
cd synchat
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Application URLs

- Frontend: http://localhost:5173

- Backend API: http://localhost:3000

- Live Link: https://synchat-green.vercel.app/

### Usage Flow

- Start the backend server.
- Start the frontend development server.
- Register a new user or log in.
- Create one-to-one or group chats.
- Exchange messages in real time.
- Use Gemini AI for contextual chat assistance.
- Manage group members if you are a group admin.

### Author

Rohan
MERN Stack Developer
