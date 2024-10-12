import axiosInstance from "./axiosInstance";

const API_URL = "/general-data";

// Create general data for a user (POST)
export const createGeneralData = async (data: any) => {
  try {
    const response = await axiosInstance.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error("Error creating general data:", error);
    throw error;
  }
};

// Fetch general data for a specific user (GET)
export const getUserGeneralData = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching general data:", error);
    throw error;
  }
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
