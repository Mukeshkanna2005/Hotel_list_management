import axios from "axios";

const API_BASE = "/api/hotels";

const hotelApi = {
  // GET all hotels with optional filters
  getAll: async (params = {}) => {
    const response = await axios.get(API_BASE, { params });
    return response.data;
  },

  // GET single hotel by ID
  getById: async (id) => {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data;
  },

  // POST create hotel (multipart form data)
  create: async (formData) => {
    const response = await axios.post(API_BASE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // PUT update hotel (multipart form data)
  update: async (id, formData) => {
    const response = await axios.put(`${API_BASE}/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // DELETE hotel
  delete: async (id) => {
    const response = await axios.delete(`${API_BASE}/${id}`);
    return response.data;
  },
};

export default hotelApi;
