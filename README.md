# Product Browser Backend

A simple backend application that allows users to browse 200,000+ products efficiently with category filtering and cursor-based pagination.

## Problem

The goal is to browse a large dataset of products (~200,000 products) while maintaining good performance.

Requirements:

- Show newest products first
- Filter products by category
- Support pagination
- Handle data changes while users are browsing
- Avoid duplicate or missing products when new products are added or updated

---

## Solution

This project uses:

- Node.js
- Express.js
- PostgreSQL (Supabase)
- Cursor Pagination
- Category Filtering
- Indexed Queries

The backend provides APIs to fetch products efficiently even when the dataset becomes very large.

---

## Database

Each product contains:

- id
- name
- category
- price
- created_at
- updated_at

A seed script generates 200,000 products automatically.

---

## Database Indexes

To keep pagination fast, the following indexes are used:

```sql
CREATE INDEX idx_products_order
ON products(updated_at DESC, id DESC);

CREATE INDEX idx_products_category_order
ON products(category, updated_at DESC, id DESC);
```

These indexes allow PostgreSQL to quickly locate products without scanning the entire table.

---

## Why Cursor Pagination?

Traditional OFFSET pagination becomes slower as data grows.

Example:

```sql
SELECT *
FROM products
ORDER BY updated_at DESC
LIMIT 20 OFFSET 100000;
```

The database still needs to scan and skip 100,000 rows before returning results.

This becomes inefficient for large datasets.

### Cursor Pagination Approach

This project uses:

```sql
(updated_at, id)
```

as the cursor.

Example:

```sql
WHERE (updated_at, id) < ('2026-06-23 10:00:00', 1500)
ORDER BY updated_at DESC, id DESC
LIMIT 20;
```

### Benefits

- Fast on large datasets
- Uses database indexes efficiently
- No duplicate products
- No missing products
- Stable while new products are inserted or updated

This ensures users can continue browsing without seeing the same product twice or skipping products.

---

## API Endpoints

### Get Products

```http
GET /products
```

Returns the latest products.

### Filter by Category

```http
GET /products?category=Electronics
```

Returns products only from the selected category.

### Cursor Pagination

```http
GET /products?cursorUpdatedAt=2026-06-23T10:00:00.000Z&cursorId=1500
```

Returns the next page of products after the provided cursor.

### Combined Example

```http
GET /products?category=Electronics&cursorUpdatedAt=2026-06-23T10:00:00.000Z&cursorId=1500
```

Returns the next page of Electronics products.

---

## Frontend Features

- Product listing
- Category dropdown filter
- Load More button
- Cursor-based pagination
- Clean and responsive UI

---

## Project Structure

```text
codevector/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── routes/
│   └── products.js
│
├── db.js
├── seed.js
├── server.js
├── .env
├── package.json
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd codevector
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_supabase_connection_string
PORT=5000
```

### Run Seed Script

```bash
node seed.js
```

### Start Server

```bash
node server.js
```

Server will run on:

```text
http://localhost:5000
```

---

## Deployment

### Backend

- Render

### Database

- Supabase PostgreSQL

---

## Author

Built as a backend assignment demonstrating:

- Large dataset handling
- PostgreSQL indexing
- Cursor pagination
- Filtering
- API development using Node.js and Express