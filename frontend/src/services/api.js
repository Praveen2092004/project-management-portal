import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Pass query parameters seamlessly to the backend endpoint string
export const fetchTasks = (search = '', status = 'All Statuses', page = 1, sortBy = 'createdAt') => {
  return API.get(`/tasks?search=${search}&status=${status}&page=${page}&sortBy=${sortBy}`);
};

export const createTask = (taskData) => API.post('/tasks', taskData);
export const updateTask = (id, updatedData) => API.put(`/tasks/${id}`, updatedData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);