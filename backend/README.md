# NetShop Backend - Complete E-Commerce API

A production-ready Node.js + Express backend for the NetShop e-commerce platform with MongoDB, JWT authentication, advanced product management, and full order processing.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Development](#development)

---

## ✨ Features

### User Management
- ✅ User registration and login with JWT tokens
- ✅ Role-based access control (Customer, Seller, Admin)
- ✅ User profile management
- ✅ Password hashing with bcryptjs
- ✅ Profile updates and password changes

### Product Management
- ✅ Full CRUD operations for products
- ✅ Advanced filtering and search
- ✅ Pagination and sorting
- ✅ Product categories
- ✅ Product ratings and reviews
- ✅ Stock management
- ✅ Discount calculation with tax
- ✅ Product images support (Cloudinary integration)

### Shopping Cart
- ✅ Add/remove items from cart
- ✅ Update quantities
- ✅ Automatic price calculation
- ✅ Discount and tax computation
- ✅ Coupon code support (extensible)
- ✅ Cart persistence

### Order Management
- ✅ Order creation from cart
- ✅ Stock validation before checkout
- ✅ Automatic order number generation
- ✅ Status tracking (Pending, Confirmed, Processing, Shipped, Delivered)
- ✅ Payment status management
- ✅ Order history and admin dashboard
- ✅ Order cancellation with stock restoration
- ✅ Shipping address management

### Admin Features
- ✅ Category management
- ✅ Order status updates
- ✅ Payment status updates
- ✅ All orders dashboard
- ✅ User management (extensible)

### Technical
- ✅ JWT authentication and authorization
- ✅ Centralized error handling
- ✅ Request validation with Zod
- ✅ Security middleware (Helmet, CORS)
- ✅ Logging and debugging
- ✅ MongoDB connection pooling
- ✅ Environment variables support
- ✅ RESTful API design

---

## 🛠️ Tech Stack

### Core
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM (Object Data Modeling)

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Helmet** - HTTP headers security
- **CORS** - Cross-origin resource sharing

### Utilities
- **Zod** - Schema validation
- **Cloudinary** - Image upload and management
- **dotenv** - Environment variables

### Development
- **Nodemon** - Auto-reload during development
- **ESLint** - Code linting
- **Jest** - Testing framework

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── env.js               # Environment variables
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── productController.js # Product CRUD
│   │   ├── categoryController.js# Category CRUD
│   │   ├── cartController.js    # Cart operations
│   │   └── orderController.js   # Order management
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware
│   │   ├── validation.js        # Request validation
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Category.js          # Category schema
│   │   ├── Cart.js              # Cart schema
│   │   └── Order.js             # Order schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   ├── categoryRoutes.js    # Category endpoints
│   │   ├── cartRoutes.js        # Cart endpoints
│   │   └── orderRoutes.js       # Order endpoints
│   ├── utils/
│   │   ├── logger.js            # Logging utility
│   │   ├── jwt.js               # JWT utilities
│   │   ├── password.js          # Password hashing
│   │   ├── errorHandler.js      # Error handling
│   │   └── cloudinary.js        # Image upload
│   └── server.js                # Express app setup
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── API_DOCS.md                  # API documentation
└── README.md                    # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB (local or Atlas)
- Cloudinary account (optional, for image uploads)

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Copy environment file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
Edit `.env` with your settings:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/netshop
JWT_SECRET=your_secret_key_here
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in the backend directory:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/netshop
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/netshop

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Cloudinary (optional)
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# CORS
CORS_ORIGIN=http://localhost:3000

# Pagination
DEFAULT_PAGE_SIZE=10
MAX_PAGE_SIZE=100
```

### MongoDB Setup

#### Local MongoDB
```bash
# Start MongoDB service
mongod

# Create database (optional, MongoDB creates it automatically)
mongo
> use netshop
```

#### MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/netshop
```

### Cloudinary Setup (Optional)

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get API credentials from dashboard
3. Add to `.env`:
```env
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🏃 Running the Server

### Development Mode
```bash
npm run dev
```
Starts server with auto-reload using Nodemon.

### Production Mode
```bash
npm start
```
Starts server normally.

### Test
```bash
npm test
```

### Lint
```bash
npm run lint
npm run lint:fix
```

### Server Output
```
✅ MongoDB connected successfully
🚀 NetShop API server running on port 5000
📚 API Documentation: http://localhost:5000/api/docs
💚 Health check: http://localhost:5000/health
Environment: development
```

---

## 📚 API Documentation

Complete API documentation is available in `API_DOCS.md`.

### Quick Reference

**Base URL:** `http://localhost:5000/api`

### Authentication Endpoints
```
POST   /auth/register              # Register new user
POST   /auth/login                 # Login user
GET    /auth/me                    # Get profile
PUT    /auth/profile               # Update profile
PUT    /auth/change-password       # Change password
POST   /auth/refresh               # Refresh token
```

### Product Endpoints
```
GET    /products                   # Get products with filters
GET    /products/:id               # Get product details
POST   /products                   # Create product (Seller/Admin)
PUT    /products/:id               # Update product (Seller/Admin)
DELETE /products/:id               # Delete product (Seller/Admin)
POST   /products/:id/reviews       # Add review
```

### Category Endpoints
```
GET    /categories                 # Get categories
GET    /categories/:id             # Get category
POST   /categories                 # Create (Admin)
PUT    /categories/:id             # Update (Admin)
DELETE /categories/:id             # Delete (Admin)
```

### Cart Endpoints
```
GET    /cart                       # Get cart
POST   /cart/items                 # Add to cart
PUT    /cart/items/:productId      # Update quantity
DELETE /cart/items/:productId      # Remove from cart
DELETE /cart                       # Clear cart
POST   /cart/coupon                # Apply coupon
```

### Order Endpoints
```
POST   /orders                     # Create order
GET    /orders                     # Get user orders
GET    /orders/:id                 # Get order details
PUT    /orders/:id/cancel          # Cancel order
PUT    /orders/:id/status          # Update status (Admin)
PUT    /orders/:id/payment         # Update payment (Admin)
GET    /orders/admin/all           # All orders (Admin)
```

---

## 🗄️ Database Models

### User Model
```javascript
{
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: Enum ['customer', 'admin', 'seller'],
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  slug: String (unique),
  description: String,
  category: ObjectId (ref: Category),
  brand: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  tax: Number,
  stock: Number,
  sku: String (unique),
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  seller: ObjectId (ref: User),
  averageRating: Number,
  totalReviews: Number,
  reviews: [{
    userId: ObjectId,
    rating: Number,
    comment: String
  }],
  isActive: Boolean,
  specifications: Object,
  createdAt: Date
}
```

### Cart Model
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    discount: Number,
    tax: Number
  }],
  subtotal: Number,
  discountAmount: Number,
  taxAmount: Number,
  totalAmount: Number,
  couponCode: String,
  couponDiscount: Number,
  expiresAt: Date
}
```

### Order Model
```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number
  }],
  subtotal: Number,
  discountAmount: Number,
  taxAmount: Number,
  shippingCost: Number,
  totalAmount: Number,
  status: Enum ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
  paymentStatus: Enum ['pending', 'completed', 'failed', 'refunded'],
  paymentMethod: Enum ['credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash_on_delivery'],
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  createdAt: Date
}
```

---

## 🔐 Authentication

### JWT Flow

1. **User registers/logs in**
   - Credentials validated
   - JWT token generated with user ID
   - Token valid for 7 days

2. **Client stores token**
   - Save in localStorage or sessionStorage
   - Include in Authorization header for future requests

3. **Protected requests**
   - Token verified on each protected endpoint
   - User attached to request object
   - Role-based access control enforced

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTEyMzQ1Njc4OTBhYmNkZWYxMjM0NSIsImlhdCI6MTcwNTMzNDQwMCwiZXhwIjoxNzA2MjI2NDAwfQ.X-signature
```

### Role-Based Authorization

| Feature | Customer | Seller | Admin |
|---------|----------|--------|-------|
| Browse Products | ✅ | ✅ | ✅ |
| Create Products | ❌ | ✅ | ✅ |
| Manage Own Products | ❌ | ✅ | ✅ |
| Create Cart | ✅ | ✅ | ❌ |
| Create Orders | ✅ | ✅ | ❌ |
| Manage Categories | ❌ | ❌ | ✅ |
| View All Orders | ❌ | ❌ | ✅ |
| Update Order Status | ❌ | ❌ | ✅ |

---

## ❌ Error Handling

### Error Response Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad request
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not found
- **409** - Conflict (duplicate email, insufficient stock)
- **500** - Server error

### Exception Handling
- All errors caught by global error handler
- Proper logging for debugging
- Graceful error messages for clients
- Stack traces in development mode

---

## 🔧 Development

### Code Structure

Each module follows this pattern:

```
controller/ → routes/ → middleware/ → models/
     ↓
Handles business logic
     ↓
Defined in routes with middleware
     ↓
Middleware validates/authenticates
     ↓
Uses database models
```

### Adding New Feature

1. **Create model** in `models/`
```javascript
const schema = new mongoose.Schema({ ... });
module.exports = mongoose.model('Name', schema);
```

2. **Create controller** in `controllers/`
```javascript
async function action(req, res, next) {
  try {
    // Business logic
    sendSuccess(res, 200, 'message', data);
  } catch (error) {
    next(error);
  }
}
```

3. **Create routes** in `routes/`
```javascript
router.post('/endpoint', protect, authorize('admin'), action);
```

4. **Mount in server.js**
```javascript
app.use('/api/path', routes);
```

### Best Practices

- ✅ Always use try-catch in controllers
- ✅ Validate input with Zod schemas
- ✅ Use middleware for authentication/authorization
- ✅ Use descriptive error messages
- ✅ Log important operations
- ✅ Handle edge cases (empty cart, insufficient stock)
- ✅ Use transactions for critical operations
- ✅ Document API endpoints

---

## 🐛 Debugging

### Enable Debug Logging
```bash
DEBUG=netshop:* npm run dev
```

### Check Logs
- Server logs in terminal
- Database connection status
- Request/response details
- Errors with timestamps

### Common Issues

**MongoDB Connection Refused**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
Solution: Ensure MongoDB is running

**JWT Token Expired**
```
{
  "success": false,
  "statusCode": 401,
  "message": "Token expired"
}
```
Solution: Call `/auth/refresh` to get new token

**Invalid Category ID**
```
{
  "success": false,
  "statusCode": 400,
  "message": "Invalid 67a0987654321fedcba54321: Invalid ID"
}
```
Solution: Verify MongoDB ObjectId format

---

## 📦 Deployment

### Prepare for Production

1. **Set environment variables**
```env
NODE_ENV=production
MONGODB_URI=<production-db-uri>
JWT_SECRET=<strong-secret>
CORS_ORIGIN=<frontend-url>
```

2. **Build and test**
```bash
npm install
npm test
npm run lint
```

3. **Deploy to hosting** (Heroku, AWS, DigitalOcean, etc.)
```bash
# Example: Heroku
heroku create netshop-api
heroku config:set NODE_ENV=production
git push heroku main
```

---

## 📝 License

MIT License - feel free to use this code

---

## 🤝 Support

For issues or questions:
1. Check API_DOCS.md
2. Review error messages and logs
3. Check database connection
4. Verify environment variables
5. Test endpoints with Postman/cURL

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅
