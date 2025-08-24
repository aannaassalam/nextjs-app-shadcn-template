import { handleApiError, handleApiSuccess } from '@/utils/apiErrorHandler';

import http from '../http';

export interface InternalUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  role?: string;
  department?: string;
  specialization?: string;
  experience?: string;
  status?: 'active' | 'inactive';
  active?: boolean;
  // Add flexibility for different backend response structures
  id?: string; // Alternative id field
  fullName?: string; // Alternative name field
  profilePhoto?: string; // Alternative photo field
  phoneNumber?: string; // Alternative phone field
}

// Type for raw user data from API
interface RawUserData {
  _id?: string;
  id?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  photo?: string;
  profilePhoto?: string;
  avatar?: string;
  role?: string;
  department?: string;
  specialization?: string;
  experience?: string;
  status?: string;
  active?: boolean;
  [key: string]: unknown; // Allow additional properties
}

export interface UserSearchResponse {
  users: InternalUser[];
  total: number;
  page: number;
  limit: number;
}

// Type for creating/updating user data
export interface UserData {
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  role?: string;
  department?: string;
  specialization?: string;
  experience?: string;
  status?: 'active' | 'inactive';
  active?: boolean;
  password?: string;
}

// API response wrapper
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

// Utility function to normalize user data from API response
const normalizeUser = (rawUser: RawUserData): InternalUser => {
  const normalized = {
    _id: rawUser._id || rawUser.id || '',
    name:
      rawUser.name ||
      rawUser.fullName ||
      `${rawUser.firstName || ''} ${rawUser.lastName || ''}`.trim() ||
      'Unknown',
    email: rawUser.email || '',
    phone: rawUser.phone || rawUser.phoneNumber,
    photo:
      typeof rawUser.photo === 'string'
        ? rawUser.photo
        : typeof rawUser.profilePhoto === 'string'
          ? rawUser.profilePhoto
          : typeof rawUser.avatar === 'string'
            ? rawUser.avatar
            : undefined,
    role: rawUser.role,
    department: rawUser.department,
    specialization: rawUser.specialization,
    experience: rawUser.experience,
    status: (rawUser.status as 'active' | 'inactive') || 'active',
    active:
      typeof rawUser.active === 'boolean'
        ? rawUser.active
        : rawUser.status === 'active',
  };

  // Pass through any additional fields from the raw user data
  return { ...normalized, ...rawUser } as InternalUser;
};

export const userAPI = {
  // Get users with optional search
  getUsers: async (
    page = 1,
    limit = 10,
    search?: string
  ): Promise<UserSearchResponse> => {
    try {
      const params: Record<string, string | number> = {};

      // Add role parameter
      params.role = 'consultant';

      // Add pagination parameters
      params.page = page;
      params.limit = limit;

      // Add search parameters if search query is provided
      if (search && search.trim()) {
        params.searchFields = 'name,email';
        params.search = search.trim();
      }

      const response = await http.get('/api/v1/user/user', {
        params,
      });

      // Transform the response to match our interface based on your actual API response
      const rawUsers = response.data.data?.data || response.data.data || [];
      const normalizedUsers = rawUsers.map(normalizeUser);
      const meta = response.data.data?.meta || {};

      return {
        users: normalizedUsers,
        total: meta.totalCount || meta.results || 0,
        page: meta.currentPage || page,
        limit: meta.limit || limit,
      };
    } catch (error) {
      handleApiError(error, 'Failed to fetch users');
      throw error;
    }
  },

  // Create a new user
  createUser: async (data: UserData): Promise<ApiResponse<InternalUser>> => {
    try {
      const response = await http.post('/api/v1/user/user', {
        ...data,
        role: 'consultant',
      });

      handleApiSuccess('User created successfully');
      return {
        data: normalizeUser(response.data.data),
        message: response.data.message,
        status: response.status,
        success: true,
      };
    } catch (error) {
      handleApiError(error, 'Failed to create user');
      throw error;
    }
  },

  // Update an existing user
  updateUser: async (
    id: string,
    data: UserData
  ): Promise<ApiResponse<InternalUser>> => {
    try {
      const response = await http.patch(`/api/v1/user/user/${id}`, data);

      handleApiSuccess('User updated successfully');
      return {
        data: normalizeUser(response.data.data),
        message: response.data.message,
        status: response.status,
        success: true,
      };
    } catch (error) {
      handleApiError(error, 'Failed to update user');
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await http.delete(`/api/v1/user/user/${id}`);

      handleApiSuccess('User deleted successfully');
      return {
        data: null,
        message: response.data.message,
        status: response.status,
        success: true,
      };
    } catch (error) {
      handleApiError(error, 'Failed to delete user');
      throw error;
    }
  },

  // Get a single user by ID
  getUserById: async (id: string): Promise<ApiResponse<InternalUser>> => {
    try {
      console.log('Calling getUserById API with ID:', id); // Debug log
      const response = await http.get(`/api/v1/user/user/${id}`);
      console.log('getUserById API response:', response.data); // Debug log

      const normalizedData = normalizeUser(response.data.data);
      console.log('Normalized user data:', normalizedData); // Debug log

      return {
        data: normalizedData,
        message: response.data.message,
        status: response.status,
        success: true,
      };
    } catch (error) {
      handleApiError(error, 'Failed to fetch user details');
      throw error;
    }
  },
};

// Backward compatibility exports
export const consultantAPI = {
  searchConsultants: async (query: string, page = 1, limit = 10) => {
    const response = await userAPI.getUsers(page, limit, query);
    return { ...response, consultants: response.users };
  },
  getAllConsultants: async (page = 1, limit = 50) => {
    const response = await userAPI.getUsers(page, limit);
    return { ...response, consultants: response.users };
  },
  createConsultant: userAPI.createUser,
  updateConsultant: userAPI.updateUser,
  deleteConsultant: userAPI.deleteUser,
  getConsultantById: userAPI.getUserById,
};

export type InternalConsultant = InternalUser;
export type ConsultantData = UserData;
export type ConsultantSearchResponse = UserSearchResponse;
