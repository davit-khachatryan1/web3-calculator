import axiosInstance from './axiosInstance';

const API_URL = '/coins-calculations';

export const addCoinsCalculation = async (data: any) => {
  const response = await axiosInstance.post(API_URL, data);
  return response.data;
};

export const getUserCoinsCalculations = async (userId: string) => {
  const response = await axiosInstance.get(`${API_URL}/${userId}`);
  return response.data;
};

export const updateCoinsCalculation = async (userId: string, dataId: number, data: any) => {
  const response = await axiosInstance.put(`${API_URL}/${userId}/${dataId}`, data);
  return response.data;
};

export const deleteCoinsCalculation = async (userId: string, dataId: number) => {
  const response = await axiosInstance.delete(`${API_URL}/${userId}/${dataId}`);
  return response.data;
};
