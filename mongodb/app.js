
const express = require('express');
const connectDB = require('./db');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB().catch(() => {
    console.error('Unable to start with database disconnected');
});

// Product routes
app.use('/products', productRoutes);

// 404 middleware
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// General error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
