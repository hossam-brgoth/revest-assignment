# Revest Solutions Full-Stack Project

A full-stack web application built with Node.js, Express, Angular, Tailwind CSS, and PostgreSQL for managing sales orders and products.

## Features

- CRUD operations for products and sales orders
- Internal and external product APIs
- Authentication and authorization for external APIs
- Dynamic search and filtering for sales orders
- Responsive frontend with Tailwind CSS
- Product catalog with cross-sell section
- Shopping cart functionality
- Third-party API integration for sales orders

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Angular CLI (v15 or higher)
- npm or yarn package manager

## Project Structure

```
project/
├── backend/          # Node.js + Express backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── server.js
│   └── package.json
│
├── frontend/         # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── app.module.ts
│   │   └── styles.css
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=your_db_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   PORT=3000
   JWT_SECRET=YOUR_JWT_SECRET
   ```

4. Set up the database and insert the dummy data:
   ```bash
   psql -U your_db_user -d your_db_name -f src/config/schema.sql
   ```

5. Start the backend server:
   ```bash
   npm run dev or node src/server.js
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the environment files with your backend API URL:
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api'
   };
   ```

4. Start the frontend development server:
   ```bash
   ng serve
   ```

## API Documentation

### Products API

- `GET /api/products` - Get all products (external)
- `POST /api/products` - Create a product (internal)
- `PUT /api/products/:id` - Update a product (internal)
- `DELETE /api/products/:id` - Delete a product (internal)

### Sales Orders API

- `GET /api/sales-orders` - Get all sales orders with filters
- `POST /api/sales-orders` - Create a sales order

## Testing

Run backend tests:
```bash
cd backend && npm test
```

Run frontend tests:
```bash
cd frontend && ng test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
