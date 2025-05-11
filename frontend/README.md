# Konvo - AI Chat Application Frontend

A modern, real-time chat application built with React and Socket.IO that enables collaborative discussions with AI assistance.

## Features

- 🔐 Secure Authentication System
- 💬 Real-time Chat with Socket.IO
- 🤖 AI Integration for Enhanced Conversations
- 🌓 Dark/Light Theme Support
- 👥 Collaborative Project Spaces
- 📱 Responsive Design
- 🔄 Auto-scroll Messages
- 💾 Local Storage for Message Persistence
- 🎯 Multiple Project Support

## Tech Stack

- React 18
- Vite
- TailwindCSS
- Socket.IO Client
- Axios
- React Router v6
- Markdown-to-JSX

## Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- Backend API running (see backend README)

## Installation

1. Clone the repository:
   ```bash
   git clone
   cd frontend
   ```


2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
frontend/
├── src/
│   ├── assets/         # Static assets
│   ├── auth/           # Authentication components
│   ├── config/          # Configuration files
│   ├── context/        # React context providers
│   ├── routes/         # Route definitions
│   └── screens/        # Main application screens
```


## Application Screens

### 1. Login/Register

- User authentication
- Form validation
- Secure credential handling

### 2. Home Dashboard

- Project listing
- Project creation
- Quick navigation

### 3. Project Chat

- Real-time messaging
- Collaborator management
- Message persistence
- Markdown support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

