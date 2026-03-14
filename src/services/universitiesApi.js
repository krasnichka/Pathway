// src/services/universitiesApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getAllUniversities = async () => {
  const response = await api.get("/universities");
  return response.data;
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