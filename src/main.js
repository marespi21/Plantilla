import './style.css';
import { setupAuth } from './services/auth.js';
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderTasks } from './pages/tasks.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderLayout } from './components/layout.js';

const app = document.querySelector('#app');

const routes = {
    '/': renderLogin,
    '/login': renderLogin,
    '/register': renderRegister,
    '/tasks': renderTasks,
    '/dashboard': renderDashboard
};

function router() {
    const path = window.location.pathname;
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Auth Guards
    if (!user && (path === '/tasks' || path === '/dashboard')) {
        window.history.pushState({}, '', '/login');
        return router();
    }
    
    if (user) {
        if (path === '/' || path === '/login' || path === '/register') {
            const redirectParams = new URLSearchParams(window.location.search);
            // If we are logged in, redirect based on role
            if (user.role === 'admin') {
                window.history.pushState({}, '', '/dashboard');
            } else {
                window.history.pushState({}, '', '/tasks');
            }
            return router();
        }
        
        // Role Guards
        if (path === '/dashboard' && user.role !== 'admin') {
            window.history.pushState({}, '', '/tasks');
            return router();
        }
        if (path === '/tasks' && user.role === 'admin') {
             // Admin can manage tasks, but usually has their own view.
             // For now, let's allow admin to see tasks or redirect to dashboard?
             // Requirement: "Admin gestiona tareas... Ver todas las tareas"
             // Let's assume dashboard has the link to all tasks.
        }
    }

    const component = routes[path] || routes['/'];
    if (user && path !== '/login' && path !== '/register') {
        app.innerHTML = '';
        renderLayout(app, component);
    } else {
        component(app);
    }
}

// Handle navigation
window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', () => {
    setupAuth();
    router();
});

export function navigate(path) {
    window.history.pushState({}, '', path);
    router();
}
