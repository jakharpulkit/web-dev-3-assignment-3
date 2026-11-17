const validateProduct = (req, res, next) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ message: 'Product data is required' });
    }

    const requiredFields = ['name', 'sku', 'category', 'price', 'quantity', 'reorderLevel', 'supplier'];
    if (req.method === 'POST') {
        for (const field of requiredFields) {
            if (data[field] === undefined || data[field] === null || data[field] === '') {
                return res.status(400).json({ message: field + ' is required' });
            }
        }
    }

    const stringFields = ['name', 'sku', 'category', 'supplier'];
    for (const field of stringFields) {
        if (data[field] !== undefined && (typeof data[field] !== 'string' || data[field].trim() === '')) {
            return res.status(400).json({ message: field + ' must be a non-empty string' });
        }
    }

    const numberFields = ['price', 'quantity', 'reorderLevel'];
    for (const field of numberFields) {
        if (data[field] !== undefined) {
            if (typeof data[field] !== 'number' || !Number.isFinite(data[field]) || data[field] < 0) {
                return res.status(400).json({ message: field + ' must be a valid non-negative number' });
            }
            if ((field === 'quantity' || field === 'reorderLevel') && !Number.isInteger(data[field])) {
                return res.status(400).json({ message: field + ' must be a whole number' });
            }
        }
    }

    next();
};

module.exports = validateProduct;
