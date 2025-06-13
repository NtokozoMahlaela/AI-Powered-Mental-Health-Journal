console.log('Starting test server...');

const http = require('http');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server is running!\n');
});

// Start the server
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Try accessing http://localhost:5000 in your browser');
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server stopped');
  });
});
