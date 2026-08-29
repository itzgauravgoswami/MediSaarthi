// MediSaarthi Express Application
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const { helmetConfig } = require('./config/security');
const requestIdMiddleware = require('./middleware/requestId.middleware');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

// Routes
const apiV1Router = require('./routes/index');
const patientRoutes = require('./routes/patient.routes');
const redFlagRoutes = require('./routes/redFlag.routes');
const ayushRoutes = require('./routes/ayush.routes');
const adminRoutes = require('./routes/admin.routes');
const healthRoutes = require('./routes/health.routes');
const speechRoutes = require('./routes/speech.routes');

const documentRoutes = require('./routes/document.routes');

const app = express();

// Security Headers & Request ID
app.use(helmetConfig);
app.use(requestIdMiddleware);

// CORS
app.use(cors(corsOptions));

// Body Parsing
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// General Rate Limiting
app.use(generalLimiter);

// Primary Versioned API
app.use('/api/v1', apiV1Router);

// Backwards Compatibility for existing frontend routes
app.use('/api/patients', patientRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/triage', redFlagRoutes);
app.use('/api/ayush', ayushRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/speech', speechRoutes);
app.use('/api/health', healthRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'MediSaarthi AI Clinical Intake & Triage API',
    status: 'online',
    version: 'v1',
    docs: '/api/v1/health'
  });
});

// 404 and Centralized Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
