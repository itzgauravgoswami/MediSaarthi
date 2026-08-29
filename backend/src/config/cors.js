// CORS Configuration
const config = require('./env');

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  config.cors.frontendUrl,
  config.cors.adminUrl
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests or allowed frontend origins
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // Allow wildcard in local development
    if (config.env === 'development') {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy: Origin not authorized.'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id', 'X-Kiosk-Id']
};

module.exports = corsOptions;
