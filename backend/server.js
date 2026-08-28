// MediSaarthi Express Backend Server

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '15mb' }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'MediSaarthi Clinical API', version: '2026.1.0' });
});

// Import Controllers & Routes
const patientRoutes = require('./routes/patientRoutes');
const triageRoutes = require('./routes/triageRoutes');
const ayushRoutes = require('./routes/ayushRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/patients', patientRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/ayush', ayushRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`[MediSaarthi Backend] Express server running on port ${PORT}`);
});

module.exports = app;
