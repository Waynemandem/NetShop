const User = require('../models/User');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.getByEmail(email);
        if (userExists) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        // Create user
        // Prevent admin creation via public API unless specific secret is used (simplified here: just allow 'user' role by default)
        const safeRole = role === 'admin' ? 'user' : 'user'; // Force user role for now for security

        const user = await User.create({
            name,
            email,
            password,
            role: safeRole
        });

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        // Check for user
        const user = await User.getByEmail(email);
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await User.matchPassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.getById(req.user.id);
        // Exclude password
        const { password, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            data: userWithoutPassword
        });
    } catch (err) {
        next(err);
    }
};

// Helper to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = User.getSignedJwtToken(user.id);

    // Exclude password from response
    const { password, ...userWithoutPassword } = user;

    res.status(statusCode).json({
        success: true,
        token,
        data: userWithoutPassword
    });
};
