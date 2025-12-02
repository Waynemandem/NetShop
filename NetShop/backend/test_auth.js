const axios = require('axios');

const API_URL = 'http://localhost:5000/api/v1/auth';

async function testAuth() {
    try {
        console.log('1. Registering user...');
        const email = `test${Date.now()}@example.com`;
        const res1 = await axios.post(`${API_URL}/register`, {
            name: 'Test User',
            email: email,
            password: 'password123'
        });
        console.log('Registered:', res1.data.data.email);
        const token = res1.data.token;

        console.log('2. Logging in...');
        const res2 = await axios.post(`${API_URL}/login`, {
            email: email,
            password: 'password123'
        });
        console.log('Logged in, Token:', res2.data.token ? 'Yes' : 'No');

        console.log('3. Getting profile...');
        const res3 = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile Name:', res3.data.data.name);

        console.log('ALL AUTH TESTS PASSED');
    } catch (error) {
        console.error('TEST FAILED:', error.response ? error.response.data : error.message);
    }
}

testAuth();
