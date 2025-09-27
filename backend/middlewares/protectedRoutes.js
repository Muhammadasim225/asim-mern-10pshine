const jwt = require("jsonwebtoken");

const protectedRoutes = (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // Agar header nahi mila, toh cookie se token le lo (cookie-parser required hai)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protectedRoutes };
