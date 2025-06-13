// Enable all debug output
process.env.DEBUG = '*';
process.env.NODE_DEBUG = '*';

// Log environment variables (without sensitive data)
console.log('=== Environment ===');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGODB_URI:', process.env.MONGO_URI ? '*** (set)' : 'not set');
console.log('===================\n');

// Log when the script starts
console.log('Starting server...');

// Log any uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('\n=== UNCAUGHT EXCEPTION ===');
  console.error(err);
  console.error('Stack:', err.stack);
  console.error('=========================\n');
  process.exit(1);
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('\n=== UNHANDLED REJECTION ===');
  console.error('Reason:', reason);
  console.error('==========================\n');
});

// Load the main application
try {
  console.log('Loading application...');
  require('./index');
  console.log('Application loaded successfully');
} catch (err) {
  console.error('\n=== ERROR LOADING APPLICATION ===');
  console.error(err);
  console.error('Stack:', err.stack);
  console.error('================================\n');
  process.exit(1);
}
