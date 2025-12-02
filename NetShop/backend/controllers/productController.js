const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        let products = await Product.getAll();

        // Filtering
        if (req.query.category) {
            products = products.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
        }

        // Search
        if (req.query.search) {
            const search = req.query.search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search)
            );
        }

        // Sorting
        if (req.query.sort) {
            if (req.query.sort === 'price_asc') {
                products.sort((a, b) => a.price - b.price);
            } else if (req.query.sort === 'price_desc') {
                products.sort((a, b) => b.price - a.price);
            } else if (req.query.sort === 'newest') {
                products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
        }

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.getById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (Admin)
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.update(req.params.id, req.body);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res, next) => {
    try {
        const success = await Product.delete(req.params.id);

        if (!success) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
