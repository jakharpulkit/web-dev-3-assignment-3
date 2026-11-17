const Product = require('../models/Product');

const createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

const getProducts = async (req, res, next) => {
    try {
        const pageValue = parseInt(req.query.page, 10);
        const limitValue = parseInt(req.query.limit, 10);
        const page = Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1;
        const limit = Number.isInteger(limitValue) && limitValue > 0 ? Math.min(limitValue, 100) : 10;
        const filter = {};

        if (req.query.category) filter.category = req.query.category;
        if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

        const allowedSortFields = ['name', 'price', 'quantity', 'category', 'createdAt'];
        let sort = { createdAt: -1 };
        if (req.query.sort) {
            const descending = req.query.sort.startsWith('-');
            const sortField = descending ? req.query.sort.slice(1) : req.query.sort;
            if (allowedSortFields.includes(sortField)) sort = { [sortField]: descending ? -1 : 1 };
        }

        const total = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            total,
            page,
            totalPages: Math.ceil(total / limit),
            count: products.length,
            products
        });
    } catch (error) {
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json({ message: 'Product deleted', id: product._id });
    } catch (error) {
        next(error);
    }
};

const lowStockReport = async (req, res, next) => {
    try {
        const products = await Product.find({
            $expr: { $lte: ['$quantity', '$reorderLevel'] }
        });
        res.status(200).json({ count: products.length, lowStockItems: products });
    } catch (error) {
        next(error);
    }
};

const categorySummary = async (req, res, next) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    totalItems: { $sum: 1 },
                    totalQuantity: { $sum: '$quantity' },
                    totalStockValue: { $sum: { $multiply: ['$price', '$quantity'] } },
                    avgPrice: { $avg: '$price' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json({ categories: summary.length, summary });
    } catch (error) {
        next(error);
    }
};

const updateStock = async (req, res, next) => {
    try {
        const change = req.body.change;
        if (typeof change !== 'number' || !Number.isFinite(change) || !Number.isInteger(change) || change === 0) {
            return res.status(400).json({ message: 'Change must be a non-zero whole number' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.quantity + change < 0) return res.status(400).json({ message: 'Insufficient stock' });

        product.quantity += change;
        await product.save();
        res.status(200).json({ message: 'Stock updated', product });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    lowStockReport,
    categorySummary,
    updateStock
};
