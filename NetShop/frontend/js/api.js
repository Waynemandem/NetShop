const API_BASE_URL = 'http://localhost:5000/api/v1';

class Api {
    static async request(endpoint, method = 'GET', body = null, token = null) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                headers['Authorization'] = `Bearer ${storedToken}`;
            }
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    static get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    static post(endpoint, body) {
        return this.request(endpoint, 'POST', body);
    }

    static put(endpoint, body) {
        return this.request(endpoint, 'PUT', body);
    }

    static delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }
}

// Export for global usage
window.Api = Api;
