import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split("Bearer ")[1];
    } else {
        return res.status(403).json({ text: 'Unauthorized', type: 'error' });
    }

    if (!token) {
        return res.status(403).json({
          text: "No token provided!",
          type: 'error' });
      }
    

    try {
            
        jwt.verify(token, process.env.JWT_SECRET,  async (err, decoded) => {
            if (err) {
            return res.status(401).json({ text: 'Unauthorized', type: 'error' });
            }

            let user = await User.findById(decoded.id);

            req.user = user;
            req.userId = user.id;
            next();
        });
    } catch (error) {
        console.log(JSON.stringify({ message: 'invalidToken', errorMessage: error.message, errorTitle: error.name }));
        return next(new ErrorResponse(401, "Session expired please relogin"));
    }
});

export const authorize = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(403, "Unauthorized access"));
    }
    next();
};