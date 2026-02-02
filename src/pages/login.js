import { login } from '../services/auth.js';
import { navigate } from '../main.js';

export function renderLogin(container) {
    container.innerHTML = `
        <div class="auth-container">
            <h2>Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="btn-primary">Login</button>
            </form>
            <p>Don't have an account? <a href="/register" id="linkRegister">Register</a></p>
        </div>
    `;

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const user = await login(email, password);
            if (user.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/tasks');
            }
        } catch (error) {
            alert(error.message);
        }
    });

    document.getElementById('linkRegister').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/register');
    });
}
