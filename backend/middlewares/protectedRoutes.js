const jwt=require("jsonwebtoken");

const protectedRoutes = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded ;
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  res.status(401).json({ message: "Not authorized, no token" });
};

module.exports={protectedRoutes}