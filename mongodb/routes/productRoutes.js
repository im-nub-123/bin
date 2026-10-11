
const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// POST - Add a new product
router.post('/', async (req, res, next) => {
    try {
        const product = new Product(req.body);
        const savedProduct = await product.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        next(error);
    }
});

// GET - Retrieve all products
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
