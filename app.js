const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const flash = require('connect-flash');

// Load environment variables
dotenv.config();
const app = express();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.json()); // Parse JSON requests
app.use(morgan('dev')); // Log HTTP requests



const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(
    session({
        secret: 'ankisyur369325djr2632qw23', // Replace with a strong, unique secret
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI, // Your MongoDB URI
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            httpOnly: true, // Prevents client-side access
            secure: false, // Set to true if using HTTPS
        },
    })
);
// Flash Middleware
app.use(flash());

// Set Global Variables for Flash Messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set the View Engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Import Routes
const indexRoutes = require('./routes/index');

// Use Routes
app.use('/', indexRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('pages/404', { title: 'Page Not Found' });
});
// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}🔥`);
});



