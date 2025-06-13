// Enable all debug output
process.env.DEBUG = '*';
process.env.NODE_DEBUG = '*';

// Log environment variables (without sensitive data)
console.log('Environment:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGODB_URI:', process.env.MONGO_URI ? '*** (set)' : 'not set');
console.log('---\nStarting server...\n');

// Load the main application
require('./index.js');
