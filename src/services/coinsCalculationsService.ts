import axiosInstance from './axiosInstance';

const API_URL = '/coins-calculations';

export const saveCoinsCalculation = async (data: any, userId: string) => {
  const response = await axiosInstance.post(API_URL, {
    ...data,
    userId,  // Include the userId in the payload
  });
  return response.data;
};

export const getUserCoinsCalculations = async (userId: string) => {
  const response = await axiosInstance.get(`${API_URL}/${userId}`);
  return response.data;
};

export const deleteCoinsCalculation = async (userId: string, dataId: string) => {
  const response = await axiosInstance.delete(`${API_URL}/${userId}/${dataId}`);
  return response.data;
};
