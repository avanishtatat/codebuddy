const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET environment variable is not defined");
        throw new Error("Server configuration error");
    };

    return jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
    );
}

module.exports = { generateToken };