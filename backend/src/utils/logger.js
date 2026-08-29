// Structured Logger using Pino

let logger;

try {
  const pino = require('pino');
  logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' }
    } : undefined
  });
} catch (e) {
  // Fallback to structured console logger if pino is initializing
  logger = {
    info: (msg, ...args) => console.log(`[INFO] ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`, ...args),
    warn: (msg, ...args) => console.warn(`[WARN] ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`, ...args),
    error: (msg, ...args) => console.error(`[ERROR] ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`, ...args),
    debug: (msg, ...args) => console.debug(`[DEBUG] ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`, ...args)
  };
}

module.exports = logger;
