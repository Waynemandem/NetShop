# NetShop API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Error Handling](#error-handling)
4. [Endpoints](#endpoints)
   - [Auth Endpoints](#auth-endpoints)
   - [Product Endpoints](#product-endpoints)
   - [Category Endpoints](#category-endpoints)
   - [Cart Endpoints](#cart-endpoints)
   - [Order Endpoints](#order-endpoints)

---

## Overview

**Base URL:** `http://localhost:5000/api`

**Version:** 1.0.0

**Content-Type:** `application/json`

The NetShop API provides complete e-commerce functionality including:
- User authentication and management
- Product catalog with search, filter, and sort
- Shopping cart management
- Order processing
- Category management
- Review system

---

## Authentication

### JWT Token Authentication

All protected endpoints require a Bearer token in the Authorization header.

**Header Format:**
```
Authorization: Bearer <token>
```

**Token Payload:**
```json
{
  "id": "user_id",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**Token Expiration:** 7 days (configurable via JWT_EXPIRE)

---

## Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | User role not authorized |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate data or stock issue |
| 500 | Server Error | Internal server error |

---

## Endpoints

# AUTH ENDPOINTS

## POST /auth/register

Register a new user account.

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }'
```

**Request Body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min 6 characters)",
  "role": "string (optional, default: 'customer', enum: ['customer', 'seller'])"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "67a1234567890abcdef12345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "customer",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (409):**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Email already registered"
}
```

---

## POST /auth/login

Login with email and password.

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "67a1234567890abcdef12345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "customer",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

## GET /auth/me

Get current authenticated user profile.

**Request:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User profile retrieved",
  "data": {
    "_id": "67a1234567890abcdef12345",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+234-123-456-7890",
    "role": "customer",
    "address": {
      "street": "123 Main St",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "zipCode": "100001"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## PUT /auth/profile

Update user profile information.

**Request:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+234-123-456-7890",
    "address": {
      "street": "456 Oak Ave",
      "city": "Abuja",
      "state": "FCT",
      "country": "Nigeria",
      "zipCode": "900001"
    }
  }'
```

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "zipCode": "string"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Profile updated successfully",
  "data": {
    "_id": "67a1234567890abcdef12345",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+234-123-456-7890",
    "address": {
      "street": "456 Oak Ave",
      "city": "Abuja",
      "state": "FCT",
      "country": "Nigeria",
      "zipCode": "900001"
    }
  }
}
```

---

## PUT /auth/change-password

Change user password.

**Request:**
```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpassword123",
    "newPassword": "newpassword456"
  }'
```

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 6 characters)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully"
}
```

---

## POST /auth/refresh

Get a new authentication token.

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Authorization: Bearer <token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Token refreshed",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

# PRODUCT ENDPOINTS

## GET /products

Get all products with advanced filtering, search, and pagination.

**Request:**
```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=10&search=nike&category=shoes&minPrice=100&maxPrice=500&sortBy=price&order=asc&inStock=true"
```

**Query Parameters:**
```
page: number (optional, default: 1)
limit: number (optional, default: 10, max: 100)
search: string (optional, searches name/description/brand)
category: string (optional, category ID or slug)
brand: string (optional)
minPrice: number (optional)
maxPrice: number (optional)
sortBy: string (optional, default: 'createdAt', enum: ['price', 'createdAt', 'name', 'rating'])
order: string (optional, default: 'desc', enum: ['asc', 'desc'])
inStock: boolean (optional, filter products in stock)
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Products retrieved",
  "data": {
    "products": [
      {
        "_id": "67a1234567890abcdef12345",
        "name": "Nike Air Max 90",
        "slug": "nike-air-max-90",
        "description": "Classic and versatile running shoe",
        "category": {
          "_id": "67a0987654321fedcba54321",
          "name": "Shoes",
          "slug": "shoes"
        },
        "brand": "Nike",
        "price": 320,
        "originalPrice": 400,
        "discount": 20,
        "discountType": "percentage",
        "tax": 5,
        "stock": 45,
        "images": [
          {
            "url": "https://cloudinary.com/image.jpg",
            "alt": "Front view",
            "isMain": true
          }
        ],
        "averageRating": 4.5,
        "totalReviews": 28,
        "seller": {
          "_id": "67a1111111111111111111111",
          "firstName": "Store",
          "lastName": "Owner",
          "shopName": "Nike Store"
        },
        "isActive": true,
        "isFeatured": true,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 245,
      "page": 1,
      "limit": 10,
      "pages": 25
    }
  }
}
```

---

## GET /products/:id

Get a single product by ID or slug.

**Request:**
```bash
curl -X GET http://localhost:5000/api/products/67a1234567890abcdef12345 \
  -H "Content-Type: application/json"
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product retrieved",
  "data": {
    "_id": "67a1234567890abcdef12345",
    "name": "Nike Air Max 90",
    "slug": "nike-air-max-90",
    "description": "Detailed product description",
    "shortDescription": "Classic running shoe",
    "category": {
      "_id": "67a0987654321fedcba54321",
      "name": "Shoes"
    },
    "brand": "Nike",
    "price": 320,
    "originalPrice": 400,
    "discount": 20,
    "discountType": "percentage",
    "tax": 5,
    "stock": 45,
    "sku": "NIKE-AIR-MAX-90-001",
    "images": [
      {
        "url": "https://cloudinary.com/image1.jpg",
        "publicId": "netshop/products/image1",
        "alt": "Front view",
        "isMain": true
      },
      {
        "url": "https://cloudinary.com/image2.jpg",
        "alt": "Side view",
        "isMain": false
      }
    ],
    "averageRating": 4.5,
    "totalReviews": 28,
    "reviews": [
      {
        "_id": "67a2222222222222222222222",
        "userId": {
          "_id": "67a3333333333333333333333",
          "firstName": "John",
          "lastName": "Doe"
        },
        "rating": 5,
        "comment": "Great product! Very comfortable.",
        "createdAt": "2024-01-10T14:20:00.000Z"
      }
    ],
    "seller": {
      "_id": "67a1111111111111111111111",
      "firstName": "Store",
      "lastName": "Owner",
      "email": "store@example.com",
      "shopName": "Nike Store"
    },
    "isActive": true,
    "isFeatured": true,
    "specifications": {
      "material": "Leather and mesh",
      "color": "White and black",
      "size": "6-13"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## POST /products

Create a new product (Seller/Admin only).

**Request:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nike Air Force 1",
    "description": "Iconic basketball shoe from 1982",
    "shortDescription": "Classic basketball sneaker",
    "category": "67a0987654321fedcba54321",
    "brand": "Nike",
    "price": 280,
    "originalPrice": 350,
    "discount": 20,
    "discountType": "percentage",
    "tax": 5,
    "stock": 100,
    "lowStockThreshold": 20,
    "sku": "NIKE-AF1-001",
    "tags": ["shoes", "basketball", "sneakers"],
    "specifications": {
      "material": "Leather",
      "color": "White",
      "sizes": "6-13"
    }
  }'
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (required)",
  "shortDescription": "string (optional)",
  "category": "string (required, MongoDB ObjectId)",
  "brand": "string (optional)",
  "price": "number (required, > 0)",
  "originalPrice": "number (optional)",
  "discount": "number (optional, default: 0)",
  "discountType": "string (optional, default: 'percentage', enum: ['percentage', 'fixed'])",
  "tax": "number (optional, default: 0, tax percentage)",
  "stock": "number (required, >= 0)",
  "lowStockThreshold": "number (optional, default: 10)",
  "sku": "string (optional, must be unique)",
  "tags": "array of strings (optional)",
  "specifications": "object (optional, flexible structure)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Product created successfully",
  "data": {
    "_id": "67a1234567890abcdef12345",
    "name": "Nike Air Force 1",
    "slug": "nike-air-force-1",
    "description": "Iconic basketball shoe from 1982",
    "category": "67a0987654321fedcba54321",
    "price": 280,
    "stock": 100,
    "seller": "67a1111111111111111111111",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## PUT /products/:id

Update a product (Seller/Admin only).

**Request:**
```bash
curl -X PUT http://localhost:5000/api/products/67a1234567890abcdef12345 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 250,
    "stock": 85,
    "isActive": true
  }'
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "category": "string (optional)",
  "price": "number (optional)",
  "stock": "number (optional)",
  "isActive": "boolean (optional)",
  "isFeatured": "boolean (optional)",
  "discount": "number (optional)",
  "specifications": "object (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product updated successfully",
  "data": {
    "_id": "67a1234567890abcdef12345",
    "name": "Nike Air Force 1",
    "price": 250,
    "stock": 85,
    "updatedAt": "2024-01-16T15:45:00.000Z"
  }
}
```

---

## DELETE /products/:id

Delete a product (Seller/Admin only).

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/products/67a1234567890abcdef12345 \
  -H "Authorization: Bearer <token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Product deleted successfully"
}
```

---

## POST /products/:id/reviews

Add a review to a product (Authenticated users only).

**Request:**
```bash
curl -X POST http://localhost:5000/api/products/67a1234567890abcdef12345/reviews \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Excellent product! Great quality and fast delivery."
  }'
```

**Request Body:**
```json
{
  "rating": "number (required, 1-5)",
  "comment": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review added successfully",
  "data": {
    "_id": "67a1234567890abcdef12345",
    "averageRating": 4.7,
    "totalReviews": 29,
    "reviews": [
      {
        "userId": "67a3333333333333333333333",
        "rating": 5,
        "comment": "Excellent product! Great quality and fast delivery.",
        "createdAt": "2024-01-16T16:00:00.000Z"
      }
    ]
  }
}
```

---

# CATEGORY ENDPOINTS

## GET /categories

Get all categories with pagination.

**Request:**
```bash
curl -X GET "http://localhost:5000/api/categories?page=1&limit=10&search=shoes&sortBy=displayOrder"
```

**Query Parameters:**
```
page: number (optional, default: 1)
limit: number (optional, default: 10)
search: string (optional)
sortBy: string (optional, default: 'displayOrder')
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories retrieved",
  "data": {
    "categories": [
      {
        "_id": "67a0987654321fedcba54321",
        "name": "Shoes",
        "slug": "shoes",
        "description": "Footwear and sneakers",
        "image": "https://cloudinary.com/category.jpg",
        "icon": "fas fa-shoe-prints",
        "isActive": true,
        "displayOrder": 1,
        "createdAt": "2024-01-10T08:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 12,
      "page": 1,
      "limit": 10,
      "pages": 2
    }
  }
}
```

---

## GET /categories/:id

Get a single category by ID or slug.

**Request:**
```bash
curl -X GET http://localhost:5000/api/categories/shoes
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category retrieved",
  "data": {
    "_id": "67a0987654321fedcba54321",
    "name": "Shoes",
    "slug": "shoes",
    "description": "Footwear and sneakers",
    "image": "https://cloudinary.com/category.jpg",
    "icon": "fas fa-shoe-prints",
    "displayOrder": 1
  }
}
```

---

## POST /categories

Create a new category (Admin only).

**Request:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "image": "https://cloudinary.com/electronics.jpg",
    "icon": "fas fa-laptop",
    "displayOrder": 2
  }'
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "image": "string (optional, Cloudinary URL)",
  "icon": "string (optional)",
  "displayOrder": "number (optional, default: 0)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "_id": "67a4444444444444444444444",
    "name": "Electronics",
    "slug": "electronics",
    "displayOrder": 2
  }
}
```

---

## PUT /categories/:id

Update a category (Admin only).

**Request:**
```bash
curl -X PUT http://localhost:5000/api/categories/67a0987654321fedcba54321 \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Updated category description",
    "displayOrder": 5
  }'
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category updated successfully",
  "data": {
    "_id": "67a0987654321fedcba54321",
    "name": "Shoes",
    "description": "Updated category description",
    "displayOrder": 5
  }
}
```

---

## DELETE /categories/:id

Delete a category (Admin only).

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/categories/67a0987654321fedcba54321 \
  -H "Authorization: Bearer <admin-token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Category deleted successfully"
}
```

---

# CART ENDPOINTS

## GET /cart

Get user's shopping cart.

**Request:**
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer <token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cart retrieved",
  "data": {
    "_id": "67a5555555555555555555555",
    "user": "67a1234567890abcdef12345",
    "items": [
      {
        "_id": "67a6666666666666666666666",
        "product": {
          "_id": "67a1234567890abcdef12345",
          "name": "Nike Air Max 90",
          "price": 320,
          "image": "https://cloudinary.com/image.jpg"
        },
        "quantity": 2,
        "price": 320,
        "discount": 64,
        "tax": 16
      }
    ],
    "subtotal": 640,
    "discountAmount": 128,
    "taxAmount": 32,
    "couponCode": null,
    "couponDiscount": 0,
    "totalAmount": 544,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## POST /cart/items

Add item to cart.

**Request:**
```bash
curl -X POST http://localhost:5000/api/cart/items \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "67a1234567890abcdef12345",
    "quantity": 2
  }'
```

**Request Body:**
```json
{
  "productId": "string (required, MongoDB ObjectId)",
  "quantity": "number (optional, default: 1, min: 1)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Item added to cart",
  "data": {
    "_id": "67a5555555555555555555555",
    "items": [
      {
        "product": "67a1234567890abcdef12345",
        "quantity": 2,
        "price": 320,
        "discount": 64,
        "tax": 16
      }
    ],
    "totalAmount": 544
  }
}
```

---

## PUT /cart/items/:productId

Update cart item quantity.

**Request:**
```bash
curl -X PUT http://localhost:5000/api/cart/items/67a1234567890abcdef12345 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 5
  }'
```

**Request Body:**
```json
{
  "quantity": "number (required, 0 to remove, >= 1 to update)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cart updated",
  "data": {
    "_id": "67a5555555555555555555555",
    "items": [
      {
        "product": "67a1234567890abcdef12345",
        "quantity": 5
      }
    ],
    "totalAmount": 1296
  }
}
```

---

## DELETE /cart/items/:productId

Remove item from cart.

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/cart/items/67a1234567890abcdef12345 \
  -H "Authorization: Bearer <token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Item removed from cart",
  "data": {
    "_id": "67a5555555555555555555555",
    "items": [],
    "totalAmount": 0
  }
}
```

---

## DELETE /cart

Clear entire cart.

**Request:**
```bash
curl -X DELETE http://localhost:5000/api/cart \
  -H "Authorization: Bearer <token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cart cleared",
  "data": {
    "_id": "67a5555555555555555555555",
    "items": [],
    "totalAmount": 0
  }
}
```

---

## POST /cart/coupon

Apply coupon code to cart.

**Request:**
```bash
curl -X POST http://localhost:5000/api/cart/coupon \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "couponCode": "SAVE20"
  }'
```

**Request Body:**
```json
{
  "couponCode": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Coupon applied",
  "data": {
    "_id": "67a5555555555555555555555",
    "couponCode": "SAVE20",
    "couponDiscount": 50,
    "totalAmount": 494
  }
}
```

---

# ORDER ENDPOINTS

## POST /orders

Create order from cart.

**Request:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "street": "123 Main St",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "zipCode": "100001",
      "phone": "+234-123-456-7890"
    },
    "billingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "street": "123 Main St",
      "city": "Lagos",
      "state": "Lagos",
      "country": "Nigeria",
      "zipCode": "100001"
    },
    "paymentMethod": "credit_card",
    "notes": "Please deliver before 6 PM"
  }'
```

**Request Body:**
```json
{
  "shippingAddress": {
    "firstName": "string (optional, defaults to user's name)",
    "lastName": "string (optional)",
    "street": "string (required)",
    "city": "string (required)",
    "state": "string (required)",
    "country": "string (required)",
    "zipCode": "string (required)",
    "phone": "string (optional)"
  },
  "billingAddress": {
    "firstName": "string",
    "lastName": "string",
    "street": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "zipCode": "string"
  },
  "paymentMethod": "string (optional, default: 'credit_card', enum: ['credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash_on_delivery'])",
  "notes": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "_id": "67a7777777777777777777777",
    "orderNumber": "ORD-1705334400000-1",
    "user": "67a1234567890abcdef12345",
    "items": [
      {
        "product": "67a1234567890abcdef12345",
        "quantity": 2,
        "price": 320,
        "discount": 64,
        "tax": 16
      }
    ],
    "subtotal": 640,
    "discountAmount": 128,
    "taxAmount": 32,
    "shippingCost": 0,
    "totalAmount": 544,
    "status": "pending",
    "paymentStatus": "pending",
    "paymentMethod": "credit_card",
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "street": "123 Main St",
      "city": "Lagos",
      "country": "Nigeria"
    },
    "createdAt": "2024-01-16T10:30:00.000Z"
  }
}
```

---

## GET /orders

Get user's orders with pagination.

**Request:**
```bash
curl -X GET "http://localhost:5000/api/orders?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer <token>"
```

**Query Parameters:**
```
page: number (optional, default: 1)
limit: number (optional, default: 10)
status: string (optional, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Orders retrieved",
  "data": {
    "orders": [
      {
        "_id": "67a7777777777777777777777",
        "orderNumber": "ORD-1705334400000-1",
        "items": [
          {
            "product": {
              "_id": "67a1234567890abcdef12345",
              "name": "Nike Air Max 90"
            },
            "quantity": 2,
            "price": 320
          }
        ],
        "totalAmount": 544,
        "status": "pending",
        "paymentStatus": "pending",
        "createdAt": "2024-01-16T10:30:00.000Z"
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

## GET /orders/:id

Get order details.

**Request:**
```bash
curl -X GET http://localhost:5000/api/orders/67a7777777777777777777777 \
  -H "Authorization: Bearer <token>"
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order retrieved",
  "data": {
    "_id": "67a7777777777777777777777",
    "orderNumber": "ORD-1705334400000-1",
    "user": {
      "_id": "67a1234567890abcdef12345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+234-123-456-7890"
    },
    "items": [
      {
        "product": {
          "_id": "67a1234567890abcdef12345",
          "name": "Nike Air Max 90",
          "price": 320,
          "images": [
            {
              "url": "https://cloudinary.com/image.jpg"
            }
          ]
        },
        "quantity": 2,
        "price": 320,
        "discount": 64,
        "tax": 16
      }
    ],
    "subtotal": 640,
    "discountAmount": 128,
    "taxAmount": 32,
    "shippingCost": 50,
    "totalAmount": 594,
    "status": "processing",
    "paymentStatus": "completed",
    "paymentMethod": "credit_card",
    "transactionId": "txn_1234567890",
    "trackingNumber": "NG-TRACK-123456789",
    "estimatedDelivery": "2024-01-25T00:00:00.000Z",
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "street": "123 Main St",
      "city": "Lagos",
      "country": "Nigeria"
    },
    "notes": "Please deliver before 6 PM",
    "createdAt": "2024-01-16T10:30:00.000Z"
  }
}
```

---

## PUT /orders/:id/cancel

Cancel an order.

**Request:**
```bash
curl -X PUT http://localhost:5000/api/orders/67a7777777777777777777777/cancel \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Changed my mind about the purchase"
  }'
```

**Request Body:**
```json
{
  "reason": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "67a7777777777777777777777",
    "orderNumber": "ORD-1705334400000-1",
    "status": "cancelled",
    "totalAmount": 594
  }
}
```

---

## PUT /orders/:id/status (Admin Only)

Update order status.

**Request:**
```bash
curl -X PUT http://localhost:5000/api/orders/67a7777777777777777777777/status \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "shipped",
    "notes": "Order has been dispatched from warehouse"
  }'
```

**Request Body:**
```json
{
  "status": "string (required, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])",
  "notes": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order status updated",
  "data": {
    "_id": "67a7777777777777777777777",
    "status": "shipped",
    "adminNotes": "2024-01-16T14:00:00.000Z: Order has been dispatched from warehouse"
  }
}
```

---

## PUT /orders/:id/payment (Admin Only)

Update payment status.

**Request:**
```bash
curl -X PUT http://localhost:5000/api/orders/67a7777777777777777777777/payment \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentStatus": "completed",
    "transactionId": "txn_1234567890",
    "paymentGateway": "stripe"
  }'
```

**Request Body:**
```json
{
  "paymentStatus": "string (required, enum: ['pending', 'completed', 'failed', 'refunded'])",
  "transactionId": "string (required)",
  "paymentGateway": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment status updated",
  "data": {
    "_id": "67a7777777777777777777777",
    "paymentStatus": "completed",
    "transactionId": "txn_1234567890"
  }
}
```

---

## GET /orders/admin/all (Admin Only)

Get all orders (admin dashboard).

**Request:**
```bash
curl -X GET "http://localhost:5000/api/orders/admin/all?page=1&limit=20&status=shipped" \
  -H "Authorization: Bearer <admin-token>"
```

**Query Parameters:**
```
page: number (optional, default: 1)
limit: number (optional, default: 10)
status: string (optional)
userId: string (optional, filter by user ID)
```

**Success Response (200):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "All orders retrieved",
  "data": {
    "orders": [
      {
        "_id": "67a7777777777777777777777",
        "orderNumber": "ORD-1705334400000-1",
        "user": {
          "_id": "67a1234567890abcdef12345",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "totalAmount": 594,
        "status": "shipped",
        "paymentStatus": "completed",
        "createdAt": "2024-01-16T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  }
}
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Start Production Server
```bash
npm start
```

---

## Role-Based Access

| Endpoint | Customer | Seller | Admin |
|----------|----------|--------|-------|
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| GET /products | ✅ | ✅ | ✅ |
| POST /products | ❌ | ✅ | ✅ |
| PUT /products/:id | ❌ | ✅* | ✅ |
| DELETE /products/:id | ❌ | ✅* | ✅ |
| GET /cart | ✅ | ✅ | ❌ |
| POST /orders | ✅ | ✅ | ❌ |
| GET /orders | ✅ | ✅ | ❌ |
| GET /orders/admin/all | ❌ | ❌ | ✅ |
| POST /categories | ❌ | ❌ | ✅ |
| PUT /categories/:id | ❌ | ❌ | ✅ |
| DELETE /categories/:id | ❌ | ❌ | ✅ |

*Seller can only modify their own products

---

## Common Response Patterns

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field validation error"
    }
  ]
}
```

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10, max: 100)

**Response:**
```json
{
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

## Filtering & Sorting

### Product Filtering
```
GET /products?search=nike&category=shoes&minPrice=100&maxPrice=500&inStock=true
```

### Product Sorting
```
GET /products?sortBy=price&order=asc
```

Supported sort fields: `price`, `createdAt`, `name`, `rating`

---

## Frontend Integration Example

```javascript
// Register
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123'
  })
}).then(res => res.json()).then(data => console.log(data.data.token));

// Add to cart
fetch('http://localhost:5000/api/cart/items', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: '67a1234567890abcdef12345',
    quantity: 2
  })
}).then(res => res.json()).then(data => console.log(data));

// Get products
fetch('http://localhost:5000/api/products?page=1&limit=10&search=nike')
  .then(res => res.json())
  .then(data => console.log(data.data.products));
```

---

**Last Updated:** January 2024
**Version:** 1.0.0
**Status:** Production Ready
