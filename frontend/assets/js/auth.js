// assets/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            errorMessage.textContent = '';

            try {
                const data = await api.login(email, password);
                localStorage.setItem('accessToken', data.accessToken);
                window.location.href = '/dashboard.html';
            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            errorMessage.textContent = '';

            try {
                await api.register(name, email, password);
                // Automatically log in after successful registration
                const data = await api.login(email, password);
                localStorage.setItem('accessToken', data.accessToken);
                window.location.href = '/dashboard.html';
            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }
});