import jwt from 'jsonwebtoken';
import User from '../models/User.js';


 //Verify JWT token 

export const verifyToken = (req, res, next) => {
    try {
        // Getting token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];
        
        // Decode the token using the same token secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info to request
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
};

/**
 * Role-based Access Control middleware 
 * @param {...string} allowedRoles - Roles that can access this route
 */
export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated.'
            });
        }

        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
};