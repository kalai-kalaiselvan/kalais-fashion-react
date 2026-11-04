const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
};


exports.verifyRole = (role) => {

    return (req, res, next) => {

        if (req.user.role !== role) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        next();

    };

};