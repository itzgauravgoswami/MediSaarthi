// Database Connection Manager with Hybrid In-Memory Demo Fallback
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('./env');

let isConnected = false;
let isInMemoryFallback = false;

async function connectDB() {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(config.db.uri, {
      serverSelectionTimeoutMS: 2500 // Fast fail to avoid blocking startup if MongoDB is offline
    });
    isConnected = true;
    isInMemoryFallback = false;
    logger.info(`[MongoDB] Connected successfully to: ${conn.connection.host}`);
  } catch (error) {
    logger.warn(`[MongoDB] Live connection unavailable (${error.message}). Activating MediSaarthi Resilient Demo Mode with In-Memory Clinical Store.`);
    isConnected = true;
    isInMemoryFallback = true;
  }
}

function getDatabaseStatus() {
  return {
    connected: isConnected,
    isInMemory: isInMemoryFallback,
    mode: isInMemoryFallback ? 'In-Memory Clinical Sandbox' : 'Live MongoDB'
  };
}

module.exports = {
  connectDB,
  getDatabaseStatus
};
