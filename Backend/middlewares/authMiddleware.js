const jwt = require('jsonwebtoken');

// Protect routes middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // Expected: Bearer <token>

  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });

    req.user = user;
    next();
  });
};

// Optional: restrict access by role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
