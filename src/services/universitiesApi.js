// src/services/universitiesApi.js
import axios from "axios";

// ✅ Прямой адрес без basePath
const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllUniversities = async () => {
  try {
    const response = await api.get("/universities");
    console.log("✅ Universities loaded:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching universities:", error);
    throw error;
  }
};

export const getUniversityById = async (id) => {
  const response = await api.get(`/universities/${id}`);
  return response.data;
};

export const searchUniversities = async (query) => {
  const response = await api.get("/universities", {
    params: { name_like: query },
  });
  return response.data;
};

export const getDirectionsByCategory = async (category) => {
  const response = await api.get("/universities");
  const universities = response.data;
  
  return universities
    .map((uni) => ({
      ...uni,
      directions: uni.directions.filter((dir) => dir.category === category),
    }))
    .filter((uni) => uni.directions.length > 0);
};