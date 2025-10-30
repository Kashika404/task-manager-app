// In src/api.ts
import axios from 'axios';


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5112';
const API_URL = `${BASE_URL}/api/tasks`;


export interface TaskItem {
  id: string; 
  description: string;
  isCompleted: boolean;
}


export const getTasks = () => {
  return axios.get<TaskItem[]>(API_URL);
};


export const addTask = (description: string) => {
  return axios.post<TaskItem>(API_URL, { description });
};


export const updateTask = (id: string, task: TaskItem) => {
  return axios.put<TaskItem>(`${API_URL}/${id}`, task);
};


export const deleteTask = (id: string) => {
  return axios.delete(`${API_URL}/${id}`);
};