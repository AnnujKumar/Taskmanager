require("dotenv").config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require("./routes/taskRoutes");
const connectDB = require("./database");
const commentRoutes = require("./routes/commentRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security: CORS (Cross-Origin Resource Sharing)
app.use(cors());


// Security: Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);



// Routes
app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/comment', commentRoutes);
app.use('/stats', statsRoutes);

// Test Route
app.post("/hi", (req, res) => {
    return res.json({ message: "Your request reached successfully" });
});

module.exports = app;