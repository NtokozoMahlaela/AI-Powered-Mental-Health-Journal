# AI-Powered Mental Health Journal

A full-stack application for journaling with AI-powered insights for mental health tracking and self-reflection.

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (local or cloud instance)

## Setup Instructions

### 1. Server Setup

1. Navigate to the server directory:
   ```bash
   cd Mental-Health-Journal/server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm run dev
   ```
   The server will be available at `http://localhost:5000`

### 2. Client Setup

1. Navigate to the client directory:
   ```bash
   cd Mental-Health-Journal/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The client will be available at `http://localhost:3000`

## Features

- User authentication (register/login)
- Create and manage journal entries
- AI-powered insights on journal entries
- Secure data storage
- Responsive design

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Journal Entries
- `GET /api/journal` - Get all journal entries (protected)
- `POST /api/journal` - Create a new journal entry (protected)

## Environment Variables

### Server (.env)
- `PORT` - Port on which the server will run (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT authentication
- `NODE_ENV` - Environment (development/production)

## Troubleshooting

- If you encounter CORS issues, ensure the client URL is correctly set in the server's CORS configuration.
- Make sure MongoDB is running if using a local instance.
- Check the console logs for both client and server for any error messages.

## License

This project is licensed under the MIT License.