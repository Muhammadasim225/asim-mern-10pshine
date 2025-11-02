const jwt = require("jsonwebtoken");
const db=require('../config/database');
const logger = require("../logs/logging");
const User=db.user
const protectedRoutes = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]
    logger.info({ source: 'header', action: 'token_received' }, "Token received from Authorization header");
  } 
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    logger.info({ source: 'cookie', action: 'token_received' }, "Token received from cookies");
  }


  if (!token) {
    logger.warn({ action: 'no_token', path: req.originalUrl }, "No token provided in request");
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    logger.info({ action: 'token_verified', userId: decoded.id }, "JWT token verified successfully");
    req.user = decoded;
    next();
  } catch (err) {
    logger.error("JWT verification error:", err);  // <--- add this
    res.status(401).json({ message: "Invalid token" });
  }
};

const checkCurrentUser = async (req, res) => {  // Make async
  try {
    const userId = req.user.id;
    if (!userId) {
      logger.warn(
        { action: "no_user_id", path: req.originalUrl },
        "Request made without valid user ID in token"
      );
    }
    const user = await User.findByPk(userId);  // Fetch fresh from DB
    if (!user) {
      logger.warn(
        { action: "user_not_found", userId },
        "User not found in database"
      );
      return res.status(404).json({ message: 'User not found' });
    }
    logger.info(
      { action: "current_user_fetched", userId },
      "Current user fetched successfully"
    );

    res.json({
      id: user.id,
      email_address: user.email_address,
      full_name: user.full_name,
      avatar: user.avatar
    });
  } catch (err) {
    logger.error(
      {
        action: "error_fetching_current_user",
        error: err.message,
        stack: err.stack,
        userId: req.user?.id || "unknown",
      },
      "Error fetching current user"
    );
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = { protectedRoutes, checkCurrentUser };
