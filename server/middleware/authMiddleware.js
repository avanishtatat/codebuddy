const jwt = require('jsonwebtoken'); 

const protect = (req, res, next) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET environment variable is not defined");
        return res.status(500).json({ message: "Server configuration error" });
    };

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        };
        res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = protect ;