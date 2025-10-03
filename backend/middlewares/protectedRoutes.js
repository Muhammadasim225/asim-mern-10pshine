const jwt = require("jsonwebtoken");

const protectedRoutes = (req, res, next) => {
  let token;

  // Check Authorization header for Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1]
    console.log("Bearer sy token mil gya:- ",token);
  } 
  // Agar header nahi mila, toh cookie se token le lo (cookie-parser required hai)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("Token recieved from cookies :- ", token);  // <---- add this for debugging

  }
  console.log("Token received:", token);  // <---- add this for debugging


  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Yeh decoded he:- ",decoded)
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);  // <--- add this
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { protectedRoutes };
