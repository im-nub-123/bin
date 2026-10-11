
const express = require('express');
const morgan = require('morgan');
const winston = require('winston');
const fs = require('fs');
const path = require('path');

const app = express();

// Create logs directory if it does not exist
const logDir = path.join(__dirname, 'logs');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: path.join(logDir, 'app.log')
        })
    ]
});

// Middleware to parse JSON
app.use(express.json());

// Morgan HTTP request logging
// Morgan HTTP request logging
app.use(morgan('tiny', {
stream: {
    write:(message)=>logger.info(message.trim())
}
}));

// Custom request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();

    logger.info(
        `${req.method} ${req.url} - ${timestamp}`
    );

    next();
});

// In-memory orders list
let orders = [];

// GET /orders - Fetch all orders
app.get('/orders', (req, res) => {
    logger.info('Fetched all orders.');
    res.status(200).json(orders);
});

// POST /orders - Add a new order
app.post('/orders', (req, res) => {
    const { customer, product, quantity } = req.body;

    // Validate required fields
    if (
        !customer ||
        !product ||
        quantity === undefined ||
        quantity === null ||
        customer.trim() === '' ||
        product.trim() === '' ||
        !Number.isInteger(Number(quantity)) ||
        Number(quantity) <= 0
    ) {
        logger.error('Invalid order: Missing fields.');
        return res.status(400).json({
            error: 'Invalid order: Missing fields.'
        });
    }

    const newOrder = {
        customer,
        product,
        quantity: Number(quantity)
    };

    orders.push(newOrder);

    logger.info(
        `New order placed by ${customer} for ${newOrder.quantity} ${product}.`
    );

    res.status(201).json(newOrder);
});

// Error-handling middleware
app.use((err, req, res, next) => {
    logger.error(`Application error: ${err.message}`);

    res.status(500).json({
        error: 'Internal Server Error'
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
