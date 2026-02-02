import { apiFetch } from './api.js';

export const taskService = {
    async getAll() {
        return await apiFetch('/tasks');
    },

    async getByUserId(userId) {
        return await apiFetch(`/tasks?userId=${userId}`);
    },

    async create(task) {
        return await apiFetch('/tasks', {
            method: 'POST',
            body: JSON.stringify({
                ...task,
                createdAt: new Date().toISOString()
            })
        });
    },

    async update(id, updates) {
        return await apiFetch(`/tasks/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates)
        });
    },

    async delete(id) {
        return await apiFetch(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }
};
