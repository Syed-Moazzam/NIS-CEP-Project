const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.role) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        });

        const { password, ...newUser } = user?._doc;

        res.json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.authenticateUser = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, 'secretKey', { expiresIn: '15m' });
        let loggedInUser = user?._doc;
        loggedInUser = { ...loggedInUser, token };
        const { password, ...finalUser } = loggedInUser;
        res.json({ message: 'Login successful', finalUser });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.authenticateUserByRole = async (req, res) => {
    try {
        const { role, password } = req.body;
        if (!role || !password) {
            return res.status(400).json({ error: 'Role and password are required' });
        }

        const users = await User.find({ role });
        if (!users.length) {
            return res.status(401).json({ error: 'Invalid role or password' });
        }

        // For simplicity, check the password of the first user in the list
        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid role or password' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, 'secretKey', { expiresIn: '15m' });
        console.log('token', token);

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};