import axiosInstance from "./axiosInstance";

const API_URL = "/general-data";

// Create general data for a user (POST)
export const createGeneralData = async (data: any, userId: string) => {
  const response = await axiosInstance.post(`/general-data/${userId}`, data);
  return response.data;
};

// Fetch general data for a specific user (GET)
export const getGeneralDataByUserId = async (userId: string) => {
  const response = await axiosInstance.get(`/general-data/${userId}`);
  return response.data;
};

// Update general data for a user (PATCH)
export const updateGeneralData = async (userId: string, data: any) => {
  try {
    const response = await axiosInstance.patch(`${API_URL}/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating general data:", error);
    throw error;
  }
};
