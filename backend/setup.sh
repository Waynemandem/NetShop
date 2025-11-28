#!/bin/bash

# NetShop Backend - Quick Start Setup Script
# ============================================
# This script automates the backend setup process

echo "🚀 NetShop Backend - Quick Start Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 16.0.0"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")" || exit

echo "📦 Installing dependencies..."
npm install

if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration values"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration:"
echo "   - MongoDB connection string"
echo "   - JWT secret key"
echo "   - Cloudinary credentials (optional)"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Start production server:"
echo "   npm start"
echo ""
echo "4. View API documentation:"
echo "   - See API_DOCS.md for full API reference"
echo "   - Health check: http://localhost:5000/health"
echo "   - API docs: http://localhost:5000/api/docs"
echo ""
