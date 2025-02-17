import jwt from "jsonwebtoken";
import { configDotenv } from 'dotenv';

configDotenv();

export const authMiddleware = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error });
    }
};

export const adminAuthMiddleware = (req, res, next) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        req.user = decoded;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token", error: error });
    }
};


export const verifyApiKey = (req, res, next) => {
    const apiKey = process.env.APIKEY;
    const recievedApiKey = req.headers['admin-api-key'];

    if (apiKey !== recievedApiKey ) {
        return res.status(403).json({ message: 'Unauthorized request!' });
    }

    next();
};
