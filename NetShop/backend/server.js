const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static folder for frontend (optional, if serving from same origin)
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/wishlist', require('./routes/wishlistRoutes'));

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
