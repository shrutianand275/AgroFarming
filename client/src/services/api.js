import axios from "axios";

// ==========================================
// BACKEND BASE URL
// ==========================================

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// ==========================================
// AUTH TOKEN
// ==========================================

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("agroToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// ==========================================
// AUTH APIs
// ==========================================

// Register
export const registerUser = async (data) => {
  const response = await API.post(
    "/auth/register",
    data
  );

  return response.data;
};


// Login
export const loginUser = async (data) => {
  const response = await API.post(
    "/auth/login",
    data
  );

  return response.data;
};


// Get currently logged-in user
export const getCurrentUser = async () => {
  const response = await API.get(
    "/auth/me"
  );

  return response.data;
};


// Logout
export const logoutUser = () => {
  localStorage.removeItem("agroToken");
  localStorage.removeItem("agroUser");
};


// ==========================================
// CLIMATE APIs
// ==========================================

// Get all states
export const getStates = async () => {
  const response = await API.get(
    "/climate/states"
  );

  return response.data;
};


// Get cities by state
export const getCities = async (state) => {
  const response = await API.get(
    `/climate/cities/${encodeURIComponent(state)}`
  );

  return response.data;
};


// Get climate data
export const getClimateData = async (data) => {
  const response = await API.post(
    "/climate/data",
    data
  );

  return response.data;
};


// ==========================================
// PROFILE APIs
// ==========================================

// Get profile
export const getProfile = async () => {
  const response = await API.get(
    "/profile"
  );

  return response.data;
};


// Update profile
export const updateProfile = async (data) => {
  const response = await API.put(
    "/profile",
    data
  );

  return response.data;
};


// ==========================================
// CROP RECOMMENDATION
// ==========================================

export const recommendCrop = async (data) => {
  const response = await API.post(
    "/crop/recommend",
    data
  );

  return response.data;
};


// ==========================================
// FERTILIZER RECOMMENDATION
// ==========================================

export const recommendFertilizer = async (data) => {
  const response = await API.post(
    "/fertilizer/recommend",
    data
  );

  return response.data;
};


// ==========================================
// DISEASE PREDICTION
// ==========================================

export const predictDisease = async (data) => {
  const response = await API.post(
    "/disease/predict",
    data
  );

  return response.data;
};


// ==========================================
// YIELD PREDICTION
// ==========================================

// Get available crops, seasons, states,
// soil types and irrigation methods
export const getYieldOptions = async () => {
  const response = await API.get(
    "/yield/options"
  );

  return response.data;
};


// Predict crop yield
export const predictYield = async (data) => {
  const response = await API.post(
    "/yield/predict",
    data
  );

  return response.data;
};


// ==========================================
// DEFAULT API
// ==========================================

export default API;