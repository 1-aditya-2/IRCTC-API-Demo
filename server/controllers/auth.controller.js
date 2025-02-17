import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWTSECRET, { expiresIn: '1h' });
};

const handleRegistration = async (req, res, role = 'user') => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(name, email, hashedPassword, role);
        await newUser.save();

        return res.json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });
    } catch (error) {
        console.error(`Error registering ${role}:`, error.message);
        res.status(500).json({ message: `Error registering ${role}` });
    }
};

const handleLogin = async (req, res, role = null) => {
    const { email, password } = req.body;
    try {
        const user = await User.findByEmail(email);
        if (!user || (role && user.role !== role)) {
            return res.status(401).json({ message: `${role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'} does not exist` });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user);
        return res.json({ message: `${role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'} login successful`, token });
    } catch (error) {
        console.error(`Error during ${role || 'user'} login:`, error.message);
        return res.status(500).json({ message: `Unable to log in at this moment` });
    }
};

// User routes
export const register = (req, res) => handleRegistration(req, res, 'user');
export const login = (req, res) => handleLogin(req, res);

// Admin routes
export const registerAdmin = (req, res) => handleRegistration(req, res, 'admin');
export const loginAdmin = (req, res) => handleLogin(req, res, 'admin');
