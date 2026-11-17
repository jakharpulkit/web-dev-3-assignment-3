const express = require('express');
const router = express.Router();

const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    lowStockReport,
    categorySummary,
    updateStock
} = require('../controllers/productController');

const validateProduct = require('../middleware/validateProduct');

router.get('/low-stock', lowStockReport);
router.get('/summary', categorySummary);
router.post('/', validateProduct, createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', validateProduct, updateProduct);
router.patch('/:id/stock', updateStock);
router.delete('/:id', deleteProduct);

module.exports = router;
