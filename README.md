# Inventory and Data Management System — Lab 3

A REST API for inventory management built with Node.js, Express.js, MongoDB, Mongoose and dotenv.

## Requirements

- Node.js 18 or newer and npm
- MongoDB Community Server running locally, or a MongoDB connection string
- Postman (optional; a ready-to-import collection is included)

## Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/jakharpulkit/web-dev-3-assignment-3.git
   cd web-dev-3-assignment-3
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set `MONGO_URI` to your MongoDB connection string. The default local value is `mongodb://127.0.0.1:27017/inventoryDB`.
4. Start MongoDB.
5. Start the API:

   ```bash
   npm start
   ```

The API runs at `http://localhost:5000`.

## Automated tests

Run the dependency-free validation middleware tests with:

```bash
npm test
```

These tests cover required POST fields, partial PUT updates, empty payloads, negative values and whole-number stock validation. They do not replace live API/database integration tests.

## API endpoints

Base URL: `http://localhost:5000/api/products`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/` | Create a product |
| GET | `/` | List products with filtering, sorting and pagination |
| GET | `/:id` | Get one product |
| PUT | `/:id` | Update product details |
| DELETE | `/:id` | Delete a product |
| PATCH | `/:id/stock` | Increase or decrease stock |
| GET | `/low-stock` | Get products at or below their reorder level |
| GET | `/summary` | Category-wise inventory aggregation |

### Query parameters

- `category`: filter by category, for example `?category=Stationery`
- `search`: search product names, for example `?search=pen`
- `sort`: sort by `name`, `price`, `quantity`, `category` or `createdAt`; prefix with `-` for descending order, for example `?sort=-price`
- `page` and `limit`: pagination, for example `?page=1&limit=10`

### Create product JSON

```json
{
  "name": "Gel Pen Pack of 15",
  "sku": "STNY-PN-713",
  "category": "Stationery",
  "price": 120,
  "quantity": 40,
  "reorderLevel": 20,
  "supplier": "Cello Pens"
}
```

### Stock adjustment JSON

Send a positive `change` to restock and a negative `change` for a sale:

```json
{
  "change": 10
}
```

The API rejects a stock adjustment that would make quantity negative.

## Postman collection

Import `postman/Inventory-Management-System.postman_collection.json` into Postman. Set the collection variable `baseUrl` to `http://localhost:5000` if needed, then run the requests in collection order. The Create Product request saves the generated product ID for subsequent requests.

## Postman screenshots — pending

The Postman application was not available in the build environment, and no genuine Postman response screenshots have been captured yet. Add screenshots from actual Postman responses to `screenshots/` and include them here. Do not use mock or fabricated screenshots as test evidence.

Suggested filenames:

- `screenshots/01-create-product.png`
- `screenshots/02-get-products.png`
- `screenshots/03-get-single-product.png`
- `screenshots/04-update-product.png`
- `screenshots/05-stock-adjustment.png`
- `screenshots/06-delete-product.png`
- `screenshots/07-low-stock-report.png`
- `screenshots/08-category-summary.png`

## Notes

- `.env` is excluded from Git. Never commit database credentials.
- The Postman collection covers the main API operations. Live endpoint tests require the server and MongoDB to be running.
