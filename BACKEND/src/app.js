// create server
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const movieRoutes = require('./routes/movie.routes');
const bookRoutes = require('./routes/book.routes');
const buildRoutes = require('./routes/build.routes');
const paymentRoutes = require("./routes/paymentRoutes");
const cors = require('cors');

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Helo ");
})

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/build', buildRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Something went wrong!"
    });
});

module.exports = app;
