import { taskService } from '../services/taskService.js';
import { getCurrentUser, logout } from '../services/auth.js';
import { navigate } from '../main.js';

export async function renderTasks(container) {
    const user = getCurrentUser();
    if (!user) {
        navigate('/login');
        return;
    }

    container.innerHTML = `
        <div class="tasks-container">
            <header class="page-header">
                <h2>My Tasks</h2>
                <div class="user-controls">
                    <span>Welcome, ${user.fullName}</span>
                    <button id="logoutBtn" class="btn-secondary">Logout</button>
                </div>
            </header>

            <div class="task-form-section">
                <h3>Add New Task</h3>
                <form id="createTaskForm">
                    <div class="form-group">
                        <input type="text" id="taskTitle" placeholder="Task Title" required>
                    </div>
                    <div class="form-group">
                        <textarea id="taskDesc" placeholder="Description"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Add Task</button>
                </form>
            </div>

            <div class="tasks-list" id="tasksList">
                <p>Loading tasks...</p>
            </div>
        </div>
    `;

    // Event Listeners
    document.getElementById('logoutBtn').addEventListener('click', () => {
        logout();
    });

    document.getElementById('createTaskForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDesc').value;

        try {
            await taskService.create({
                title,
                description,
                userId: user.id,
                status: 'pending'
            });
            document.getElementById('createTaskForm').reset();
            loadTasks();
        } catch (error) {
            console.error(error);
            alert('Error creating task');
        }
    });

    // Load Tasks
    async function loadTasks() {
        const listContainer = document.getElementById('tasksList');
        try {
            const tasks = await taskService.getByUserId(user.id);
            if (tasks.length === 0) {
                listContainer.innerHTML = '<p>No tasks found.</p>';
                return;
            }

            listContainer.innerHTML = tasks.map(task => `
                <div class="task-card ${task.status}">
                    <div class="task-header">
                        <h4>${task.title}</h4>
                        <span class="status-badge ${task.status}">${task.status}</span>
                    </div>
                    <p>${task.description || ''}</p>
                    <div class="task-actions">
                        ${task.status === 'pending' ?
                    `<button class="btn-small success" onclick="window.completeTask('${task.id}')">Complete</button>` :
                    `<button class="btn-small warning" onclick="window.reopenTask('${task.id}')">Reopen</button>`
                }
                        <button class="btn-small danger" onclick="window.deleteTask('${task.id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            listContainer.innerHTML = '<p>Error loading tasks.</p>';
        }
    }

    // Global handlers for inline onclicks (simple approach for vanilla JS)
    window.completeTask = async (id) => {
        await taskService.update(id, { status: 'completed' });
        loadTasks();
    };

    window.reopenTask = async (id) => {
        await taskService.update(id, { status: 'pending' });
        loadTasks();
    };

    window.deleteTask = async (id) => {
        if (confirm('Are you sure?')) {
            await taskService.delete(id);
            loadTasks();
        }
    };

    loadTasks();
}
