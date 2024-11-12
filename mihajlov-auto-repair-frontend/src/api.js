// api.js
import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:5105/api";

// Fetch models from the backend
export const fetchModels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Model`);
    return response.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
};


// Fetch types from the backend
export const fetchTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Type`);
      return response.data;
    } catch (error) {
      console.error("Error fetching types:", error);
      throw error;
    }
  };

  export const createReservation = async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Reservation`, {
        userId: formData.userId,
        username: formData.name,
        modelId: formData.modelId,
        typeId: formData.typeId,
        description: formData.description,
        dateTime: formData.dateTime,
      });
  
      return response.data; // Return the created reservation or success response
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  };
