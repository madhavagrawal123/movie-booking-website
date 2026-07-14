const userModel = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
   
    const { name, email, password, role } = req.body;
    if(!name || !email || !password ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
     const isUserAlreadyExists = await userModel.findOne({
        email
    });
    if(isUserAlreadyExists) {
        return res.status(400).json({ message: "User already exists" });
    }
     const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role: role || "user"
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    })
}

async function loginUser(req, res) {
    const { email, password } = req.body;   
    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }       
    const user = await userModel.findOne({
        email
    }); 
    if(!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET);
    // res.cookie("token", token);
    res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000 // optional: 7 days
});
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role
        }
    });
}

async function logoutUser(req, res) {
    console.log("logout hitting");
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}
module.exports = {
    registerUser,
    loginUser,
    logoutUser
}
