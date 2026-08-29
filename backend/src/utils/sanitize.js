// Input Sanitization & NoSQL Injection Prevention

/**
 * Strips prohibited MongoDB query operator keys ($where, $regex injection, etc.) from user input
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const cleanObj = {};
  for (const key of Object.keys(obj)) {
    // Prohibit keys starting with $ or containing dots in keys
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }
    cleanObj[key] = sanitizeObject(obj[key]);
  }
  return cleanObj;
}

/**
 * Remove PII/passwords before returning user models
 */
function sanitizeUser(user) {
  if (!user) return null;
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.__v;
  return userObj;
}

module.exports = {
  sanitizeObject,
  sanitizeUser
};
