import { handleApiError, handleApiSuccess } from '@/utils/apiErrorHandler';

import http from '../http';
import generateApis from './generateApis';

export interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  photo?: string;
  addressLine1?: string;
  addressLine2?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  consultantType: 'internal' | 'external';
  comments?: string;
  internalConsultant?: string; // ObjectId as string
  externalConsultant?: {
    name: string;
    email: string;
    phone?: string;
  };
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'expired';
  subscriptionStartDate?: string; // ISO date string
  subscriptionEndDate?: string; // ISO date string
}

export interface CustomerResponse {
  status: number;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    countryCode?: string;
    photo?: string;
    addressLine1?: string;
    addressLine2?: string;
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    consultantType: 'internal' | 'external';
    comments?: string;
    internalConsultant?:
      | string
      | {
          _id: string;
          name: string;
          email: string;
          role: string;
          phone?: string;
          photo?: string;
          createdAt: string;
          updatedAt: string;
          __v?: number;
        };
    externalConsultant?: {
      name: string;
      email: string;
      phone?: string;
    };
    subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'expired';
    subscriptionStartDate?: string;
    subscriptionEndDate?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
  };
}

// Interface for alert data
export interface AlertData {
  email: string;
  name: string;
  subscriptionEndDate: Date;
  customerId?: string; // Optional, if customer is associated
}

// Generate the base API methods
const baseCustomerAPI = generateApis('/api/v1/user/customer');

// Export the customer API methods
export const customerAPI = {
  // Create a new customer
  createCustomer: async (
    customerData: CustomerData
  ): Promise<CustomerResponse> => {
    try {
      const response = await baseCustomerAPI.create(customerData);
      console.log('test1:', response); // Debug log
      handleApiSuccess('Customer created successfully');
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to create customer');
      throw error;
    }
  },

  // Get all customers with search support
  getCustomers: async (
    page = 1,
    limit = 10,
    search?: string,
    internalConsultant?: string
  ): Promise<{
    status: number;
    message: string;
    data: {
      customers: CustomerResponse['data'][];
      total: number;
      page: number;
      limit: number;
    };
  }> => {
    try {
      let query = `?page=${page}&limit=${limit}`;
      if (search && search.trim()) {
        query += `&searchFields=name,email&search=${encodeURIComponent(search.trim())}`;
      }
      if (internalConsultant && internalConsultant.trim()) {
        query += `&internalConsultant=${encodeURIComponent(internalConsultant.trim())}`;
      }
      const response = await baseCustomerAPI.getAll(query);

      console.log('Raw API response:', response.data); // Debug log

      // Handle the actual API response structure
      return {
        status: response.status || 200,
        message: response.message || 'Customers fetched successfully',
        data: {
          customers: response.data,
          total: response.meta?.totalCount || response.data.data.length,
          page: response.meta?.currentPage || page,
          limit: response.meta?.limit || limit,
        },
      };
    } catch (error) {
      handleApiError(error, 'Failed to fetch customers');
      throw error;
    }
  },

  // Get customer by ID
  getCustomerById: async (id: string): Promise<CustomerResponse> => {
    try {
      const response = await baseCustomerAPI.getOne(id);
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to fetch customer details');
      throw error;
    }
  },

  // Update customer
  updateCustomer: async (
    id: string,
    customerData: Partial<CustomerData>
  ): Promise<CustomerResponse> => {
    try {
      const response = await baseCustomerAPI.updateOne(id, customerData);
      handleApiSuccess('Customer updated successfully');
      return response;
    } catch (error) {
      handleApiError(error, 'Failed to update customer');
      throw error;
    }
  },

  // Delete customer
  deleteCustomer: async (
    id: string
  ): Promise<{ status: number; message: string }> => {
    try {
      const response = await baseCustomerAPI.deleteOne(id);
      handleApiSuccess('Customer deleted successfully');
      return {
        status: response.status || 200,
        message: response.message || 'Customer deleted successfully',
      };
    } catch (error) {
      handleApiError(error, 'Failed to delete customer');
      throw error;
    }
  },

  // Send renewal subscription alert
  sendRenewSubscriptionAlert: async (
    data: AlertData[]
  ): Promise<{ status: number; message: string }> => {
    try {
      const response = await http.post(
        '/api/v1/user/sendRenewSubscriptionAlert',
        {
          data,
        }
      );

      const successMessage =
        response.data?.message || 'Alert sent successfully';
      handleApiSuccess(successMessage);

      return {
        status: response.status || 200,
        message: successMessage,
      };
    } catch (error) {
      handleApiError(error, 'Failed to send renewal alert');
      throw error;
    }
  },
};
