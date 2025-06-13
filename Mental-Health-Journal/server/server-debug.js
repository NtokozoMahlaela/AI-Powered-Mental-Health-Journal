// Enable debug logging
process.env.DEBUG = '*';
process.env.NODE_DEBUG = '*';

console.log('=== Starting Server with Debug ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Current directory:', __dirname);

// Load environment variables
require('dotenv').config();

const http = require('http');
const express = require('express');

// Create Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Create HTTP server
const server = http.createServer(app);

// Get port from environment or use a dynamic port
const PORT = process.env.PORT || 0; // 0 will assign a random available port

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  const address = server.address();
  console.log('\n=== Server Started ===');
  console.log(`Server running at http://localhost:${address.port}`);
  console.log('Press Ctrl+C to stop the server');
  console.log('======================\n');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Consider whether you want to exit the process here
  // process.exit(1);
});
