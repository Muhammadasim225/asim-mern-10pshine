const logger = require('../logs/logging')

const requestLogger = (req, res, next) => {
  const start = Date.now();
  req.startTime = start;

  // Request log
  logger.info({
    method: req.method,
    url: req.url,
    userId: req.user?.id || 'anonymous',  
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  }, 'Incoming request');

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      responseSize: res.get('Content-Length') || 0,
    }, 'Request completed');
  });

  next();
};

module.exports = requestLogger;