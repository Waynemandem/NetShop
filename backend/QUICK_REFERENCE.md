# NetShop Backend - Quick Reference Card

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Start development server
npm run dev

# 4. Server running on
http://localhost:5000

# 5. API health check
curl http://localhost:5000/health
```

---

## 📊 API Endpoints at a Glance

### Authentication (6 endpoints)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | No | Register new user |
| POST | `/auth/login` | No | Login user |
| GET | `/auth/me` | Yes | Get profile |
| PUT | `/auth/profile` | Yes | Update profile |
| PUT | `/auth/change-password` | Yes | Change password |
| POST | `/auth/refresh` | Yes | Refresh token |

### Products (6 endpoints)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/products` | No | Get products (paginated) |
| GET | `/products/:id` | No | Get product details |
| POST | `/products` | Yes* | Create product |
| PUT | `/products/:id` | Yes* | Update product |
| DELETE | `/products/:id` | Yes* | Delete product |
| POST | `/products/:id/reviews` | Yes | Add review |

*Seller/Admin only

### Categories (5 endpoints)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/categories` | No | Get categories |
| GET | `/categories/:id` | No | Get category |
| POST | `/categories` | Admin | Create category |
| PUT | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category |

### Cart (6 endpoints)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/cart` | Yes | Get user cart |
| POST | `/cart/items` | Yes | Add item to cart |
| PUT | `/cart/items/:productId` | Yes | Update quantity |
| DELETE | `/cart/items/:productId` | Yes | Remove item |
| DELETE | `/cart` | Yes | Clear cart |
| POST | `/cart/coupon` | Yes | Apply coupon |

### Orders (7 endpoints)
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/orders` | Yes | Create order |
| GET | `/orders` | Yes | Get user orders |
| GET | `/orders/:id` | Yes | Get order details |
| PUT | `/orders/:id/cancel` | Yes | Cancel order |
| PUT | `/orders/:id/status` | Admin | Update status |
| PUT | `/orders/:id/payment` | Admin | Update payment |
| GET | `/orders/admin/all` | Admin | All orders |

---

## 🔑 Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl "http://localhost:5000/api/products?page=1&limit=10&search=nike&sortBy=price"
```

### Add to Cart
```bash
curl -X POST http://localhost:5000/api/cart/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "PRODUCT_ID",
    "quantity": 2
  }'
```

### Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "street": "123 Main St",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "zipCode": "100001"
    },
    "paymentMethod": "credit_card"
  }'
```

---

## 🗂️ File Structure

```
backend/src/
├── config/
│   ├── database.js      # MongoDB connection
│   └── env.js           # Environment variables
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── cartController.js
│   └── orderController.js
├── middleware/
│   ├── auth.js          # JWT & authorization
│   ├── validation.js    # Request validation
│   └── errorHandler.js  # Error handling
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Cart.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── categoryRoutes.js
│   ├── cartRoutes.js
│   └── orderRoutes.js
├── utils/
│   ├── logger.js        # Logging
│   ├── jwt.js           # JWT utilities
│   ├── password.js      # Password hashing
│   ├── errorHandler.js  # Error response
│   └── cloudinary.js    # Image upload
└── server.js            # Express app
```

---

## 📋 Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/netshop

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Cloudinary (optional)
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# CORS
CORS_ORIGIN=http://localhost:3000

# Pagination
DEFAULT_PAGE_SIZE=10
```

---

## 🔐 Authentication

### Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiry
Default: 7 days

### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Authorization: Bearer TOKEN"
```

---

## 🛡️ Roles & Permissions

| Action | Customer | Seller | Admin |
|--------|----------|--------|-------|
| Browse products | ✅ | ✅ | ✅ |
| Create products | ❌ | ✅ | ✅ |
| Create orders | ✅ | ✅ | ❌ |
| Manage cart | ✅ | ✅ | ❌ |
| Manage categories | ❌ | ❌ | ✅ |
| View all orders | ❌ | ❌ | ✅ |

---

## 📊 Query Parameters

### Pagination
```
?page=1&limit=10
```

### Search
```
?search=nike
```

### Filtering
```
?category=shoes&brand=nike&minPrice=100&maxPrice=500&inStock=true
```

### Sorting
```
?sortBy=price&order=asc
```

---

## ❌ Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | User role not allowed |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email, insufficient stock |
| 500 | Server Error | Internal error |

---

## 💾 Database Models

### User
```javascript
{
  firstName, lastName, email, password,
  phone, role, address, isActive
}
```

### Product
```javascript
{
  name, description, category, brand,
  price, stock, images, reviews,
  averageRating, seller
}
```

### Cart
```javascript
{
  user, items[], subtotal, taxAmount,
  discountAmount, totalAmount
}
```

### Order
```javascript
{
  orderNumber, user, items[], totalAmount,
  status, paymentStatus, shippingAddress
}
```

---

## 🧪 Quick Test

```bash
# Health check
curl http://localhost:5000/health

# Get products
curl http://localhost:5000/api/products

# Get categories
curl http://localhost:5000/api/categories

# Register (replace with your data)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"pass123"}'
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| API_DOCS.md | Complete API reference |
| README.md | Setup & overview |
| BACKEND_SUMMARY.md | Implementation details |
| FRONTEND_INTEGRATION.md | Frontend integration guide |
| QUICK_REFERENCE.md | This file |

---

## 🛠️ npm Scripts

```bash
npm start          # Production
npm run dev        # Development (auto-reload)
npm test           # Run tests
npm run lint       # Check code
npm run lint:fix   # Fix code
```

---

## ⚡ Performance Tips

- Pagination: Use `limit=10-20` for large datasets
- Search: Use backend search instead of frontend filtering
- Images: Use Cloudinary for optimization
- Caching: Implement frontend cache for product lists
- Compression: Gzip enabled via Helmet

---

## 🔒 Security Checklist

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens for authentication
- ✅ Role-based access control
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Input validation
- ✅ Environment variables for secrets

---

## 📞 Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check connection string in .env

**Token Expired**
- Call `/auth/refresh` endpoint
- Store new token

**Insufficient Stock**
- Check product stock before adding to cart
- Backend validates on checkout

**CORS Error**
- Update CORS_ORIGIN in .env to match frontend URL

---

## 🚀 Next Steps

1. **Install dependencies**: `npm install`
2. **Configure .env** with MongoDB URI and secrets
3. **Start server**: `npm run dev`
4. **Test endpoints** with provided examples
5. **Connect frontend** to API endpoints
6. **Deploy** when ready

---

## 📖 Reading Order

1. Start here (QUICK_REFERENCE.md)
2. Read API_DOCS.md for endpoints
3. Review FRONTEND_INTEGRATION.md
4. Check README.md for setup
5. Explore BACKEND_SUMMARY.md for details

---

**Version:** 1.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** January 2024

For detailed information, see API_DOCS.md 📚
