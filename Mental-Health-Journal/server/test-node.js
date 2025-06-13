console.log('Node.js is working!');
console.log('Current directory:', __dirname);
console.log('Environment:', process.env.NODE_ENV || 'development');

// Simple HTTP server test
const http = require('http');
const server = http.createServer((req, res) => {
  console.log('Request received!');
  res.end('Node.js is working!');
});

server.listen(0, '127.0.0.1', () => {
  const port = server.address().port;
  console.log(`Server running at http://127.0.0.1:${port}`);
  
  // Test the server
  const req = http.get(`http://127.0.0.1:${port}`, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log('Server response:', data.trim());
      server.close();
    });
  });
  
  req.on('error', (e) => {
    console.error('Request error:', e);
    process.exit(1);
  });
});
