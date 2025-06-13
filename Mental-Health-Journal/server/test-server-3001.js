console.log('Starting test server on port 3001...');

const http = require('http');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log('Request received:', req.url);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Test server is running on port 3001!\n');
});

// Start the server
const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://0.0.0.0:${PORT}`);
  console.log(`Try accessing http://localhost:${PORT} in your browser`);
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
