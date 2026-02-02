import { logout, getCurrentUser } from '../services/auth.js';
import { navigate } from '../main.js';

export function renderLayout(container, contentRenderer) {
    const user = getCurrentUser();

    container.innerHTML = `
        <div class="layout-container">
            <aside class="sidebar slide-in">
                <div class="flex items-center gap-2 mb-8 p-2">
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        CT
                    </div>
                    <span class="text-xl font-bold">CRUDTASK</span>
                </div>

                <nav class="flex-1">
                    ${user.role === 'admin' ? `
                        <a href="/dashboard" class="nav-link ${window.location.pathname === '/dashboard' ? 'active' : ''}" data-path="/dashboard">
                            <span>📊</span> Dashboard
                        </a>
                    ` : `
                        <a href="/tasks" class="nav-link ${window.location.pathname === '/tasks' ? 'active' : ''}" data-path="/tasks">
                            <span>✅</span> My Tasks
                        </a>
                    `}
                </nav>

                <div class="mt-auto pt-4 border-t border-slate-700">
                    <div class="flex items-center gap-3 mb-4 px-2">
                        <div class="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs">
                            ${user.fullName.charAt(0)}
                        </div>
                        <div class="flex-1 overflow-hidden">
                            <div class="text-sm font-medium truncate">${user.fullName}</div>
                            <div class="text-xs text-muted truncate">${user.role}</div>
                        </div>
                    </div>
                    <button id="logoutBtn" class="btn btn-ghost w-full justify-start text-danger">
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>
            <main class="main-content">
                <div id="page-content" class="fade-in max-w-5xl mx-auto"></div>
            </main>
        </div>
    `;

    // Handle Navigation
    container.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(link.dataset.path);
        });
    });

    // Handle Logout
    container.querySelector('#logoutBtn').addEventListener('click', logout);

    // Render Page Content
    const pageContent = container.querySelector('#page-content');
    contentRenderer(pageContent);
}
