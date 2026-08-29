// MediSaarthi Keep-Alive Service
// Prevents cloud hosting providers (e.g., Render free tier) from sleeping due to inactivity.

const config = require('../config/env');
const logger = require('../utils/logger');

let intervalId = null;

/**
 * Pings the target URL using global fetch (Node.js 18+) or native https fallback.
 * @param {string} url 
 */
async function ping(url) {
  try {
    const target = url.endsWith('/') ? `${url}api/v1/health` : `${url}/api/v1/health`;
    const response = await fetch(target, {
      method: 'GET',
      headers: {
        'User-Agent': 'MediSaarthi-KeepAlive-Bot/1.0'
      }
    });

    if (response.ok) {
      logger.info(`[Keep-Alive] Heartbeat ping successful to ${target} (Status: ${response.status})`);
    } else {
      logger.warn(`[Keep-Alive] Heartbeat ping returned status ${response.status}`);
    }
  } catch (err) {
    logger.warn(`[Keep-Alive] Heartbeat ping failed: ${err.message}`);
  }
}

/**
 * Initializes and starts the keep-alive interval.
 */
function startKeepAlive() {
  const url = config.keepAlive?.url;
  const isEnabled = config.keepAlive?.enabled;
  const intervalMs = config.keepAlive?.intervalMs || 12 * 60 * 1000; // 12 mins default

  if (!isEnabled) {
    logger.info('[Keep-Alive] Disabled by configuration.');
    return;
  }

  if (!url) {
    logger.info('[Keep-Alive] No target URL found (RENDER_EXTERNAL_URL / BACKEND_URL). Keep-alive will remain idle in local/development mode.');
    return;
  }

  logger.info(`[Keep-Alive] Initialized. Monitoring ${url} every ${Math.round(intervalMs / 60000)} minutes.`);

  // Delayed initial ping after 45 seconds to allow full startup
  setTimeout(() => {
    ping(url);
  }, 45000);

  // Periodic recurring ping
  intervalId = setInterval(() => {
    ping(url);
  }, intervalMs);

  // Ensure timer does not prevent process termination
  if (intervalId.unref) {
    intervalId.unref();
  }
}

/**
 * Stops the keep-alive interval.
 */
function stopKeepAlive() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('[Keep-Alive] Stopped.');
  }
}

module.exports = {
  startKeepAlive,
  stopKeepAlive,
  ping
};
