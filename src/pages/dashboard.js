import { taskService } from '../services/taskService.js';
import { getCurrentUser, logout } from '../services/auth.js';
import { navigate } from '../main.js';

export async function renderDashboard(container) {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        navigate('/login');
        return;
    }

    container.innerHTML = `
        <div class="dashboard-container">
            <header class="page-header">
                <h2>Admin Dashboard</h2>
                <div class="user-controls">
                    <span>Admin: ${user.fullName}</span>
                    <button id="logoutBtn" class="btn-secondary">Logout</button>
                </div>
            </header>

            <div class="stats-overview">
               <div class="stat-card">
                   <h3>Total Tasks</h3>
                   <p id="totalTasks">-</p>
               </div>
            </div>

            <div class="tasks-list" id="allTasksList">
                <p>Loading all tasks...</p>
            </div>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
        logout();
    });

    async function loadAllTasks() {
        const listContainer = document.getElementById('allTasksList');
        try {
            const tasks = await taskService.getAll();
            document.getElementById('totalTasks').textContent = tasks.length;

            if (tasks.length === 0) {
                listContainer.innerHTML = '<p>No tasks in the system.</p>';
                return;
            }

            listContainer.innerHTML = tasks.map(task => `
                <div class="task-card ${task.status}">
                    <div class="task-header">
                        <h4>${task.title} <small>(User ID: ${task.userId})</small></h4>
                        <span class="status-badge ${task.status}">${task.status}</span>
                    </div>
                    <p>${task.description || ''}</p>
                    <div class="task-actions">
                        <button class="btn-small danger" onclick="window.adminDeleteTask('${task.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            listContainer.innerHTML = '<p>Error loading tasks.</p>';
        }
    }

    window.adminDeleteTask = async (id) => {
        if (confirm('Delete this user task?')) {
            await taskService.delete(id);
            loadAllTasks();
        }
    };

    loadAllTasks();
}
