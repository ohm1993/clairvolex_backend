import jwt from 'jsonwebtoken';
const adminRoleValidation = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication token is required.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded value is",decoded);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admins can perform this action.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};
module.exports = adminRoleValidation;

