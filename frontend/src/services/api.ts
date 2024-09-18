import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getTasks = () => api.get('/tasks');
export const getTask = (id: string) => api.get(`/tasks/${id}`);
export const createTask = (task: any) => api.post('/tasks', task);
export const updateTask = (id: string, task: any) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);
export const getTaskSummary = () => api.get('/tasks/summary');

export default api;