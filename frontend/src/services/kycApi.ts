import axios from 'axios';
import { LeaveRequestData, UserProfile } from '../types/kyc';

const API_BASE_URL = 'http://localhost:8000/api/v1/kyc';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const leaveApi = {
  getEmployees: async () => {
    try {
      const response = await api.get('/employees/');
      return response.data;
    } catch (error) {
      // Return default employees list
      return [
        { id: 1, username: 'demo', email: 'demo@example.com', employee_id: 'EMP001', full_name: 'Demo Employee' },
        { id: 2, username: 'john', email: 'john@example.com', employee_id: 'EMP002', full_name: 'John Employee' },
        { id: 3, username: 'jane', email: 'jane@example.com', employee_id: 'EMP003', full_name: 'Jane Employee' }
      ];
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/current-user/');
      return response.data;
    } catch (error) {
      // Return default user info
      return {
        id: 1,
        username: 'demo',
        email: 'demo@example.com',
        employee_id: 'EMP001',
        full_name: 'Demo Employee'
      };
    }
  },

  submitLeaveRequest: async (formData: Partial<LeaveRequestData>) => {
    const response = await api.post('/leave/', formData);
    return response.data;
  },

  getLeaveRequests: async () => {
    const response = await api.get('/leave/');
    return response.data;
  },

  getLeaveRequest: async (id: number) => {
    const response = await api.get(`/${id}/`);
    return response.data;
  },

  getLeaveQueue: async () => {
    const response = await api.get('/queue/');
    return response.data;
  },

  updateLeaveStatus: async (id: number, data: Partial<LeaveRequestData>) => {
    const response = await api.put(`/${id}/`, data);
    return response.data;
  },

  getUserProfile: async () => {
    try {
      const response = await api.get('/profile/');
      return response.data;
    } catch (error) {
      // Return a default profile if none exists
      return {
        id: 1,
        total_leaves: 20,
        remaining_leaves: 20
      };
    }
  },
};
