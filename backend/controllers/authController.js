const db = require('../config/db');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters"
            });
        }

        const [existing] = await db.promise().query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await db.promise().query(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, 'user')`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Registration failed"
        });

    }
};
exports.login = async (req, res) => {

    const { email, password, role } = req.body;

    try {

        if (!email || !password || !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                message: "Invalid login details"
            });
        }

        const [users] = await db.promise().query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Check whether the selected login matches the database role

        if (user.role !== role) {
            return res.status(403).json({
                message: "You are not authorized for this login"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d'
            }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Login failed"
        });

    }
};