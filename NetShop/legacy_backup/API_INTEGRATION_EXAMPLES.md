# API Integration Examples - Request & Response

Complete examples of all API calls with request/response formats.

---

## 🔐 Authentication Endpoints

### Register User

**Frontend Code:**
```javascript
import { useAuth } from '../hooks/useAuth';

const { register } = useAuth();
await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'securePassword123',
  phone: '+1234567890',
});
```

**Backend Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customer",
      "isActive": true
    }
  }
}
```

---

### Login User

**Frontend Code:**
```javascript
const { login } = useAuth();
await login('john@example.com', 'securePassword123');
```

**Backend Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customer",
      "isActive": true
    }
  }
}
```

---

### Get Current User Profile

**Frontend Code:**
```javascript
const { getCurrentUser, user } = useAuth();
await getCurrentUser();
console.log(user);
```

**Backend Request:**
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User fetched successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country",
    "profileImage": "https://cloudinary.com/image.jpg",
    "role": "customer",
    "isActive": true
  }
}
```

---

### Update Profile

**Frontend Code:**
```javascript
const { updateProfile } = useAuth();
await updateProfile({
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+9876543210',
  address: '456 Oak Ave, City, Country',
});
```

**Backend Request:**
```http
PUT /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+9876543210",
  "address": "456 Oak Ave, City, Country"
}
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "john@example.com",
    "phone": "+9876543210",
    "address": "456 Oak Ave, City, Country"
  }
}
```

---

## 📦 Product Endpoints

### Get All Products

**Frontend Code:**
```javascript
const { products, getProducts } = useProducts();
await getProducts({
  page: 1,
  limit: 10,
  search: 'laptop',
  category: 'electronics',
  minPrice: 500,
  maxPrice: 2000,
  sortBy: 'price',
  order: 'asc',
});
```

**Backend Request:**
```http
GET /api/products?page=1&limit=10&search=laptop&category=electronics&minPrice=500&maxPrice=2000&sortBy=price&order=asc
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved",
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Dell XPS 13",
        "slug": "dell-xps-13",
        "description": "Premium ultrabook laptop",
        "category": {
          "_id": "507f1f77bcf86cd799439001",
          "name": "Laptops"
        },
        "brand": "Dell",
        "price": 1299,
        "discount": 10,
        "stock": 15,
        "images": [
          "https://cloudinary.com/product1.jpg"
        ],
        "averageRating": 4.5,
        "totalReviews": 23,
        "reviews": [...],
        "specifications": [...],
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

---

### Get Single Product

**Frontend Code:**
```javascript
const { currentProduct, getProduct } = useProducts();
await getProduct('507f1f77bcf86cd799439012');
```

**Backend Request:**
```http
GET /api/products/507f1f77bcf86cd799439012
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product retrieved",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Dell XPS 13",
    "slug": "dell-xps-13",
    "description": "Premium ultrabook laptop with stunning display",
    "category": {
      "_id": "507f1f77bcf86cd799439001",
      "name": "Laptops"
    },
    "brand": "Dell",
    "price": 1299,
    "discount": 10,
    "stock": 15,
    "images": ["https://cloudinary.com/product1.jpg"],
    "averageRating": 4.5,
    "totalReviews": 23,
    "reviews": [
      {
        "_id": "review123",
        "userId": "user123",
        "rating": 5,
        "comment": "Excellent laptop!",
        "createdAt": "2024-01-01T10:00:00Z"
      }
    ],
    "specifications": [
      { "key": "Processor", "value": "Intel Core i7" },
      { "key": "RAM", "value": "16GB" }
    ]
  }
}
```

---

### Add Review to Product

**Frontend Code:**
```javascript
const { addReview } = useProducts();
await addReview('507f1f77bcf86cd799439012', {
  rating: 5,
  comment: 'Excellent product! Highly recommended.',
});
```

**Backend Request:**
```http
POST /api/products/507f1f77bcf86cd799439012/reviews
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review added successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "reviews": [
      {
        "_id": "review456",
        "userId": "user456",
        "rating": 5,
        "comment": "Excellent product! Highly recommended.",
        "createdAt": "2024-01-15T15:30:00Z"
      }
    ],
    "averageRating": 4.7,
    "totalReviews": 24
  }
}
```

---

## 🛒 Cart Endpoints

### Get Cart

**Frontend Code:**
```javascript
const { items, totals, getCart } = useCart();
await getCart();
```

**Backend Request:**
```http
GET /api/cart
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cart retrieved",
  "data": {
    "_id": "cart123",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "_id": "cartitem1",
        "productId": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Dell XPS 13",
          "price": 1299,
          "images": ["https://cloudinary.com/product1.jpg"]
        },
        "quantity": 1
      }
    ],
    "subtotal": 1299,
    "discountAmount": 0,
    "taxAmount": 129.90,
    "totalAmount": 1428.90,
    "couponCode": null,
    "couponDiscount": 0
  }
}
```

---

### Add Item to Cart

**Frontend Code:**
```javascript
const { addToCart } = useCart();
await addToCart('507f1f77bcf86cd799439012', 2);
```

**Backend Request:**
```http
POST /api/cart
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439012",
  "quantity": 2
}
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Item added to cart",
  "data": {
    "_id": "cart123",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "_id": "cartitem1",
        "productId": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Dell XPS 13",
          "price": 1299,
          "images": ["https://cloudinary.com/product1.jpg"]
        },
        "quantity": 2
      }
    ],
    "subtotal": 2598,
    "discountAmount": 0,
    "taxAmount": 259.80,
    "totalAmount": 2857.80
  }
}
```

---

### Remove from Cart

**Frontend Code:**
```javascript
const { removeFromCart } = useCart();
await removeFromCart('cartitem1');
```

**Backend Request:**
```http
DELETE /api/cart/cartitem1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Item removed from cart",
  "data": {
    "_id": "cart123",
    "items": [],
    "subtotal": 0,
    "discountAmount": 0,
    "taxAmount": 0,
    "totalAmount": 0
  }
}
```

---

## 📦 Order Endpoints

### Create Order

**Frontend Code:**
```javascript
const { createOrder } = useOrders();
const response = await createOrder({
  shippingAddress: '123 Main St, City, Country',
  billingAddress: '123 Main St, City, Country',
  paymentMethod: 'credit_card',
});
console.log('Order Number:', response.data.orderNumber);
```

**Backend Request:**
```http
POST /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "shippingAddress": "123 Main St, City, Country",
  "billingAddress": "123 Main St, City, Country",
  "paymentMethod": "credit_card"
}
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "_id": "order123",
    "orderNumber": "ORD-2024-001",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439012",
        "quantity": 1,
        "price": 1299
      }
    ],
    "subtotal": 1299,
    "taxAmount": 129.90,
    "totalAmount": 1428.90,
    "status": "pending",
    "paymentStatus": "pending",
    "shippingAddress": "123 Main St, City, Country",
    "billingAddress": "123 Main St, City, Country",
    "createdAt": "2024-01-15T16:45:00Z"
  }
}
```

---

### Get User Orders

**Frontend Code:**
```javascript
const { orders, getOrders, pagination } = useOrders();
await getOrders({ page: 1, status: 'pending' });
```

**Backend Request:**
```http
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Orders retrieved",
  "data": {
    "orders": [
      {
        "_id": "order123",
        "orderNumber": "ORD-2024-001",
        "userId": "507f1f77bcf86cd799439011",
        "items": [...],
        "subtotal": 1299,
        "totalAmount": 1428.90,
        "status": "pending",
        "paymentStatus": "pending",
        "createdAt": "2024-01-15T16:45:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

---

### Get Order Details

**Frontend Code:**
```javascript
const { currentOrder, getOrder } = useOrders();
await getOrder('order123');
```

**Backend Request:**
```http
GET /api/orders/order123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order retrieved",
  "data": {
    "_id": "order123",
    "orderNumber": "ORD-2024-001",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Dell XPS 13",
          "price": 1299
        },
        "quantity": 1
      }
    ],
    "subtotal": 1299,
    "taxAmount": 129.90,
    "totalAmount": 1428.90,
    "status": "pending",
    "paymentStatus": "pending",
    "shippingAddress": "123 Main St, City, Country",
    "billingAddress": "123 Main St, City, Country",
    "tracking": "TRACK123456",
    "createdAt": "2024-01-15T16:45:00Z",
    "updatedAt": "2024-01-15T16:45:00Z"
  }
}
```

---

### Cancel Order

**Frontend Code:**
```javascript
const { cancelOrder } = useOrders();
await cancelOrder('order123', 'Changed my mind');
```

**Backend Request:**
```http
PUT /api/orders/order123/cancel
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "reason": "Changed my mind"
}
```

**Backend Response:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "order123",
    "orderNumber": "ORD-2024-001",
    "status": "cancelled",
    "paymentStatus": "refunded",
    "updatedAt": "2024-01-15T17:00:00Z"
  }
}
```

---

## ⚠️ Error Response Examples

### 401 Unauthorized

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Please login to continue",
  "error": "UNAUTHORIZED"
}
```

### 404 Not Found

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Product not found",
  "error": "NOT_FOUND"
}
```

### 400 Bad Request

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### 500 Server Error

```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal server error",
  "error": "INTERNAL_ERROR"
}
```

---

## 🔄 Complete User Flow Example

```javascript
// 1. Register
const { register } = useAuth();
await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  phone: '+1234567890',
});

// 2. Get Products
const { products, getProducts } = useProducts();
await getProducts({ limit: 20 });

// 3. Add to Cart
const { addToCart } = useCart();
await addToCart(productId, 2);

// 4. View Cart Totals (from backend)
const { totals } = useCart();
console.log(`Total: $${totals.totalAmount}`);

// 5. Create Order
const { createOrder } = useOrders();
const order = await createOrder({
  shippingAddress: '123 Main St',
});

// 6. View Orders
const { getOrders, orders } = useOrders();
await getOrders();

// 7. Logout
const { logout } = useAuth();
logout();
```

---

**All examples above follow the service layer → hooks → component pattern.**

Each endpoint is wrapped in error handling and loading state management automatically!
