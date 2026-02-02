import { register } from '../services/auth.js';
import { navigate } from '../main.js';

export function renderRegister(container) {
    container.innerHTML = `
        <div class="auth-container">
            <h2>Register</h2>
            <form id="registerForm">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" id="fullName" required>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit" class="btn-primary">Register</button>
            </form>
            <p>Already have an account? <a href="/login" id="linkLogin">Login</a></p>
        </div>
    `;

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await register({ fullName, email, password });
            navigate('/tasks');
        } catch (error) {
            alert(error.message);
        }
    });

    document.getElementById('linkLogin').addEventListener('click', (e) => {
        e.preventDefault();
        navigate('/login');
    });
}
