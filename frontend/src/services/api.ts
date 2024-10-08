import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

export const getTasks = () => api.get('/tasks');
export const getTask = (id: string) => api.get(`/tasks/${id}`);
export const createTask = (task: any) => api.post('/tasks', task);
export const updateTask = (id: string, task: any) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);
export const getTaskSummary = () => api.get('/tasks/summary');

export const getSummary = async () => {
    return api.get('/tasks/summary');
};
export const login = (credentials: { username: string; password: string }) =>
  api.post('/auth/login', credentials);

export const register = (userData: { username: string; password: string }) =>
  api.post('/auth/register', userData);

export default api;