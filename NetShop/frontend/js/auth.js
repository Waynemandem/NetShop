document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.style.display = 'block';
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await Api.post('/auth/login', { email, password });
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.data));
                window.location.href = 'index.html';
            } catch (error) {
                showError(error.message || 'Login failed');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await Api.post('/auth/register', { name, email, password });
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.data));
                window.location.href = 'index.html';
            } catch (error) {
                showError(error.message || 'Registration failed');
            }
        });
    }
});
