import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and other responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Log errors pour debug
    console.error('API Error:', error.response?.status, error.response?.data);
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description: string; color: string }) =>
    api.post('/projects', data),
  update: (id: string, data: Partial<{ name: string; description: string; color: string }>) =>
    api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

// Tasks API
export const tasksAPI = {
  getByProject: (projectId: string) => api.get(`/projects/${projectId}/tasks`),
  create: (projectId: string, data: { 
    title: string; 
    description?: string; 
    status: string;
    assignee?: string;
    dueDate?: string;
  }) => api.post(`/projects/${projectId}/tasks`, data),
  update: (projectId: string, taskId: string, data: Partial<{
    title: string;
    description: string;
    status: string;
    assignee: string;
    dueDate: string;
  }>) => api.put(`/projects/${projectId}/tasks/${taskId}`, data),
  delete: (projectId: string, taskId: string) => 
    api.delete(`/projects/${projectId}/tasks/${taskId}`),
  addComment: (projectId: string, taskId: string, text: string) =>
    api.post(`/projects/${projectId}/tasks/${taskId}/comments`, { text }),
};

// Team API
// Ajoutez cette section à la fin de votre fichier api.ts

// Team API
export const teamAPI = {
  getAll: () => api.get('/team'),
  add: (data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    projectId: string 
  }) => api.post('/team', data),
  remove: (id: string) => api.delete(`/team/${id}`),
  
  // NOUVEAU : Ajouter un membre à un projet spécifique
  addMemberToProject: (projectId: string, memberName: string) => 
    api.post(`/projects/${projectId}/members`, { memberName }),
  
  removeMemberFromProject: (projectId: string, memberName: string) => 
    api.delete(`/projects/${projectId}/members/${memberName}`),
};

export default api;
