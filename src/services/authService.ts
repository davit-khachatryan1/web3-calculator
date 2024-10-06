import axiosInstance from "./axiosInstance";

const API_URL = "/auth";

export const login = async (username: string, password: string) => {
  const response = await axiosInstance.post(`${API_URL}/login`, {
    username,
    password,
  });
  if (response.data.access_token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const signup = async (
  username: string,
  email: string,
  accessKey: string,
  password: string
) => {
  const response = await axiosInstance.post(`${API_URL}/signup`, {
    username,
    email,
    accessKey,
    password,
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user") || "{}");
};

export const setCurrentUser = (user: string) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeCurrentUser = () => {
  localStorage.removeItem("user");
};
