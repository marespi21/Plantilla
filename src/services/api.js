const API_URL = 'http://localhost:3000';

export async function apiFetch(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        // Handle 204 No Content
        if (response.status === 204) return null;

        return await response.json();
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
}
