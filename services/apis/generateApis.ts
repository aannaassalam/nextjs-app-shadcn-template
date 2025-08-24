import { handleApiError } from '@/utils/apiErrorHandler';

import http from '../http';

// Dynamic API generator for any routes
const generateApis = (baseUrl: string) => ({
  getOne: async (id?: string) => {
    try {
      const route = id ? `${baseUrl}/${id}` : baseUrl;
      const response = await http.get(route);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to fetch data from ${baseUrl}`);
      throw error;
    }
  },
  getAll: async (query = '') => {
    try {
      const response = await http.get(`${baseUrl}${query}`);
      return response.data.data;
    } catch (error) {
      handleApiError(error, `Failed to fetch data from ${baseUrl}`);
      throw error;
    }
  },
  create: async (data: object) => {
    try {
      const response = await http.post(`${baseUrl}`, data);
      return response?.data;
    } catch (error) {
      handleApiError(error, `Failed to create data in ${baseUrl}`);
      throw error;
    }
  },
  updateOne: async (id: string, data: object) => {
    try {
      const response = await http.patch(`${baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to update data in ${baseUrl}`);
      throw error;
    }
  },
  deleteOne: async (id: string) => {
    try {
      const response = await http.delete(`${baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      handleApiError(error, `Failed to delete data from ${baseUrl}`);
      throw error;
    }
  },
});

export default generateApis;
