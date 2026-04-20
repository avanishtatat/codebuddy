const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({ name, email, password });

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return res.status(201).json({ token, name: user.name });

  } catch (error) {
    if (error.name === "ValidationError"){
        console.error("Validation error registering user", error.message);
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages[0] });
    }
    console.error("Error registering user", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {  
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        } 

        const token = jwt.sign(
            { id: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "7d" },
        );

        return res.status(200).json({ token, name: user.name });

    } catch (error) {
        console.error("Error logging in user", error);
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
