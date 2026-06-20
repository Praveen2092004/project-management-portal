import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header (Format: Bearer <token>)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No authentication token found. Access denied." });
    }

    // Verify token
    const decodedData = jwt.verify(token, 'your_jwt_secret_key_here');
    req.userId = decodedData?.id;
    
    next(); // Pass control to the next controller function
  } catch (error) {
    res.status(401).json({ message: "Authentication failed. Invalid token." });
  }
};