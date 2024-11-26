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

export const addModel = async (newModel) => {
  try {
    var token = sessionStorage.getItem("token");
    const response = await axios.post(`${API_BASE_URL}/Model`, newModel,
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    } );

    return response.data; // Return the created model or success response
  } catch (error) {
    console.error("Error creating model:", error);
    throw error;
  }
};

export const editModel = async (model) => {
  try {
    var token = sessionStorage.getItem("token");
    await axios.put(
      `${API_BASE_URL}/Model/${model.id}`, 
    model, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
  } catch (error) {
    console.error("Error editing model:", error);
    throw error;
  }
};

export const deleteModel = async (id) => {
  try {
    var token = sessionStorage.getItem("token");
    await axios.delete(`${API_BASE_URL}/Model/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting model:", error);
    throw error;
  }
};


export const fetchTypes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Type`);
      return response.data;
    } catch (error) {
      console.error("Error fetching types:", error);
      throw error;
    }
  };

  export const addType = async (newType) => {
    try {
      var token = sessionStorage.getItem("token");
      const response = await axios.post(`${API_BASE_URL}/Type`, newType,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } );
  
      return response.data; // Return the created type or success response
    } catch (error) {
      console.error("Error creating type:", error);
      throw error;
    }
  };

  export const editType = async (type) => {
    try {
      var token = sessionStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/Type/${type.id}`, 
        type, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
    } catch (error) {
      console.error("Error editing type:", error);
      throw error;
    }
  };

  export const deleteType = async (id) => {
    try {
      var token = sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/Type/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
    } catch (error) {
      console.error("Error deleting type:", error);
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

  export const fetchReservations = async () => {
    try {
      var token = sessionStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/Reservation`, {
        
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      if(!response.ok){

      }
      return response.data;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      throw error;
    }
  };

  export const deleteReservation = async (id) => {
    try {
      var token = sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/Reservation/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      throw error;
    }
  };

  export const editReservation = async (reservation) => {
    try {
      var token = sessionStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/Reservation/${reservation.id}`, 
      reservation, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error editing reservation:", error);
      throw error;
    }
  };

  export const fetchUsers = async () => {
    try{
      var token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/User/`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data;
    } catch (error)
    {
      console.error("Error getting users:", error)
      throw error;
    }
  };

  export const updateUser = async (user) => {
    try {
      var token = sessionStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/User/${user.id}`, 
        user, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  export const deleteUser = async (id) => {
    try {
      var token = sessionStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/User/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  export const updateUserRole = async (id, role) => {
    try {
      var token = sessionStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/User/${id}/${role}`,
        {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      throw error;
    }
  };
