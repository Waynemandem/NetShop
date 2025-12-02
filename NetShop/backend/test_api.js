const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1/products';

async function testProducts() {
    try {
        console.log('1. Creating a product...');
        const res1 = await axios.post(API_URL, {
            name: 'Test Product',
            price: 99.99,
            description: 'This is a test product',
            category: 'Electronics',
            image: 'test.jpg'
        });
        console.log('Created:', res1.data.data.id);
        const id = res1.data.data.id;

        console.log('2. Fetching all products...');
        const res2 = await axios.get(API_URL);
        console.log('Count:', res2.data.count);

        console.log('3. Updating product...');
        const res3 = await axios.put(`${API_URL}/${id}`, {
            price: 199.99
        });
        console.log('Updated Price:', res3.data.data.price);

        console.log('4. Deleting product...');
        await axios.delete(`${API_URL}/${id}`);
        console.log('Deleted.');

        console.log('ALL TESTS PASSED');
    } catch (error) {
        console.error('TEST FAILED:', error.response ? error.response.data : error.message);
    }
}

testProducts();
