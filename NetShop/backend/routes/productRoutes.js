const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(createProduct); // TODO: Add auth middleware

router.route('/:id')
    .get(getProduct)
    .put(updateProduct) // TODO: Add auth middleware
    .delete(deleteProduct); // TODO: Add auth middleware

module.exports = router;
