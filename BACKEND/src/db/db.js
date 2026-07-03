const mongoose = require('mongoose');



function connectDB() {
    // console.log(process.env.MONGODB_URI);
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        })
}

module.exports = connectDB;