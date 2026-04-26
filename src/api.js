import axios from "axios";
import API_CONFIG from "./config.js";

const API_BASE_URL = API_CONFIG.STUDENT_API;
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getAllStudents() {
  try {
    const response = await apiClient.get("/");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch students";
    throw new Error(message);
  }
}

export async function getStudentById(id) {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch student";
    throw new Error(message);
  }
}

export async function addStudent(student) {
  try {
    const response = await apiClient.post("/", student);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data?.error ||
      error.message ||
      "Failed to add student";
    throw new Error(message);
  }
}

export async function updateStudent(student) {
  try {
    const response = await apiClient.put("/", student);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data?.error ||
      error.message ||
      "Failed to update student";
    throw new Error(message);
  }
}

export async function deleteStudentById(id) {
  try {
    const response = await apiClient.delete(`/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data?.error ||
      error.message ||
      "Failed to delete student";
    throw new Error(message);
  }
}

export async function getCourses() {
  try {
    const response = await axios.get(API_CONFIG.COURSE_API);
    let courses = Array.isArray(response.data) ? response.data : [];
    
    
    if (courses.length > 0) {
      const firstCourse = courses[0];
      // Check if properties need to be mapped
      if (!firstCourse.id && firstCourse.courseId) {
        courses = courses.map(c => ({
          id: c.courseId,
          name: c.courseName || c.name
        }));
      }
    }
    
    console.log("Transformed courses:", courses);
    return courses;
  } catch (error) {
    console.error("Courses API Error:", error);
    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.response?.data?.error ||
      error.message ||
      "Failed to fetch courses";
    throw new Error(message);
  }
}
