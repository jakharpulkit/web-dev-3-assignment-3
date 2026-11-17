const test = require('node:test');
const assert = require('node:assert/strict');
const validateProduct = require('../middleware/validateProduct');

function runMiddleware(method, body) {
    const req = { method, body };
    let statusCode;
    let responseBody;
    let nextCalled = false;
    const res = {
        status(code) { statusCode = code; return this; },
        json(payload) { responseBody = payload; return this; }
    };
    validateProduct(req, res, () => { nextCalled = true; });
    return { statusCode, responseBody, nextCalled };
}

const validProduct = {
    name: 'Gel Pen Pack of 15',
    sku: 'STNY-PN-713',
    category: 'Stationery',
    price: 120,
    quantity: 40,
    reorderLevel: 20,
    supplier: 'Cello Pens'
};

test('accepts a complete valid product on POST', () => {
    assert.equal(runMiddleware('POST', validProduct).nextCalled, true);
});
test('rejects a POST when a required field is missing', () => {
    const result = runMiddleware('POST', { ...validProduct, sku: undefined });
    assert.equal(result.statusCode, 400);
    assert.deepEqual(result.responseBody, { message: 'sku is required' });
});
test('accepts a partial product update on PUT', () => {
    assert.equal(runMiddleware('PUT', { price: 150 }).nextCalled, true);
});
test('rejects negative prices', () => {
    const result = runMiddleware('PUT', { price: -1 });
    assert.equal(result.statusCode, 400);
    assert.match(result.responseBody.message, /non-negative number/);
});
test('rejects fractional stock quantities', () => {
    const result = runMiddleware('PUT', { quantity: 2.5 });
    assert.equal(result.statusCode, 400);
    assert.match(result.responseBody.message, /whole number/);
});
test('rejects empty product data', () => {
    const result = runMiddleware('PUT', {});
    assert.equal(result.statusCode, 400);
    assert.deepEqual(result.responseBody, { message: 'Product data is required' });
});
