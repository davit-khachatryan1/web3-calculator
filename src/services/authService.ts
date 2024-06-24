import axiosInstance from './axiosInstance';

const API_URL = '/auth';

export const login = async (username: string, password: string) => {
  const response = await axiosInstance.post(`${API_URL}/login`, { username, password });
  if (response.data.access_token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || '{}');
};
