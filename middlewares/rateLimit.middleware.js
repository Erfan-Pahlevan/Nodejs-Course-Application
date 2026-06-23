const rateLimit = require("express-rate-limit");

function rateLimitMiddleware(windowMs = 15 * 60 * 1000, max = 100) {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 429,
      message: "Too many requests, please try again later.",
    },
  });
}

module.exports = rateLimitMiddleware;