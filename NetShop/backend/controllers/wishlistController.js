const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/v1/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
    try {
        const user = await User.getById(req.user.id);
        const wishlistIds = user.wishlist || [];

        // Fetch product details
        const allProducts = await Product.getAll();
        const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

        res.status(200).json({
            success: true,
            count: wishlistProducts.length,
            data: wishlistProducts
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add to wishlist
// @route   POST /api/v1/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
    try {
        const wishlist = await User.addToWishlist(req.user.id, req.params.productId);

        res.status(200).json({
            success: true,
            data: wishlist
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Remove from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
    try {
        const wishlist = await User.removeFromWishlist(req.user.id, req.params.productId);

        res.status(200).json({
            success: true,
            data: wishlist
        });
    } catch (err) {
        next(err);
    }
};
