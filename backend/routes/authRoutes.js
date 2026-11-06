const express = require('express');

const router = express.Router();

const {
    register,
    login
} = require('../controllers/authController');

const {
    verifyToken,
    verifyRole
} = require('../middleware/authMiddleware');

router.post('/register', register);

router.post('/login', login);

router.post('/logout', (req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 24*60*60*1000
    });

    res.json({
        message: "Logged out successfully"
    });

});

router.get('/me', verifyToken, (req, res) => {

    res.json({
        user: req.user
    });

});

router.get(
    '/user-dashboard',
    verifyToken,
    verifyRole('user'),
    (req, res) => {
        res.json({
            message: "Welcome to User Dashboard"
        });
    }
);

router.get(
    '/admin-dashboard',
    verifyToken,
    verifyRole('admin'),
    (req, res) => {
        res.json({
            message: "Welcome to Admin Dashboard"
        });
    }
);

module.exports = router;