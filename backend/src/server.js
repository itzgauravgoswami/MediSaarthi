// MediSaarthi Server Entrypoint
const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/database');
const logger = require('./utils/logger');

async function startServer() {
  // Connect to Database
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`[MediSaarthi Backend] Running in '${config.env}' mode on port ${config.port}`);
    logger.info(`[MediSaarthi Backend] Primary API: http://localhost:${config.port}/api/v1`);
    logger.info(`[MediSaarthi Backend] Health check: http://localhost:${config.port}/api/v1/health`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    logger.info('[MediSaarthi Backend] Shutting down gracefully...');
    server.close(() => {
      logger.info('[MediSaarthi Backend] Closed out remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer();

module.exports = app;
