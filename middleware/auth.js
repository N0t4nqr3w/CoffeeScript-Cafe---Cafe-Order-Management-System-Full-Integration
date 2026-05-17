import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // Authorization: Bearer <token>
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};