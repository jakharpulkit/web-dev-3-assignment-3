const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (err.code === 11000) {
        statusCode = 400;
        message = 'SKU already exists';
    }
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    }
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid Product ID';
    }
    if (err.type === 'entity.parse.failed') {
        statusCode = 400;
        message = 'Invalid JSON data';
    }

    res.status(statusCode).json({ message });
};

module.exports = errorMiddleware;
