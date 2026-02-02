import { apiFetch } from './api.js';

export async function login(email, password) {
    const users = await apiFetch(`/users?email=${email}&password=${password}`);

    if (users.length > 0) {
        const user = users[0];
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    }
    throw new Error('Invalid credentials');
}

export async function register(userData) {
    // Check if user exists
    const existing = await apiFetch(`/users?email=${userData.email}`);
    if (existing.length > 0) {
        throw new Error('Email already registered');
    }

    // Default role is user
    const newUser = {
        ...userData,
        role: 'user'
    };

    const createdUser = await apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(newUser)
    });

    localStorage.setItem('user', JSON.stringify(createdUser));
    return createdUser;
}

export function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
}

export function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
}

export function setupAuth() {
    // Check session validity if needed, for now just simple localStorage check
}
