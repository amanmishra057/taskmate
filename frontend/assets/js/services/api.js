// assets/js/services/api.js
const API_BASE_URL = '/api';

async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('accessToken');

    const headers = {
        'Content-Type': 'application/json',
       ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
       ...options,
        headers,
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        // Handle responses that might not have a body (e.g., 204 No Content)
        if (response.status === 204) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

const api = {
    // Auth
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),

    // Projects
    getProjects: () => request('/projects'),
    createProject: (name, description) => request('/projects', { method: 'POST', body: JSON.stringify({ name, description }) }),
    getTasksForProject: (projectId) => request(`/projects/${projectId}/tasks`),

    // Tasks
    createTask: (taskData) => request('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
    updateTask: (taskId, updateData) => request(`/tasks/${taskId}`, { method: 'PUT', body: JSON.stringify(updateData) }),
    deleteTask: (taskId) => request(`/tasks/${taskId}`, { method: 'DELETE' }),

    // Comments
    getCommentsForTask: (taskId) => request(`/comments/task/${taskId}`),
    addCommentToTask: (taskId, content) => request(`/comments/task/${taskId}`, { method: 'POST', body: JSON.stringify({ content }) }),
};