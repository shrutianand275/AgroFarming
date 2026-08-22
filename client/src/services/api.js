import axios from "axios";

// Backend Base URL
const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// Climate APIs
// ==============================

// Get all states
export const getStates = async () => {
  const response = await API.get("/climate/states");
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
  const response = await API.post("/climate/data", data);
  return response.data;
};

// ==============================
// Crop Recommendation
// ==============================

export const recommendCrop = async (data) => {
  const response = await API.post(
    "/crop/recommend",
    data
  );

  return response.data;
};

// ==============================
// Fertilizer Recommendation
// ==============================

export const recommendFertilizer = async (data) => {
  const response = await API.post(
    "/fertilizer/recommend",
    data
  );

  return response.data;
};

// ==============================
// Disease Prediction
// ==============================

export const predictDisease = async (data) => {
  const response = await API.post(
    "/disease/predict",
    data
  );

  return response.data;
};

export default API;