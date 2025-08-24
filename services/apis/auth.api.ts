import { LoginData, RegisterData } from '@/constants/interface.constant';
import http from '@/services/http';
import { handleApiError, handleApiSuccess } from '@/utils/apiErrorHandler';

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth`;

export const loginApi = async (data: LoginData) => {
  try {
    const response = await http.post(`${baseUrl}/login`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Login failed');
    throw error;
  }
};

export const signupApi = async (data: RegisterData) => {
  try {
    const response = await http.post(`${baseUrl}/signup`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Signup failed');
    throw error;
  }
};

// Forgot Password APIs
export const forgotPasswordApi = async (email: string) => {
  try {
    const response = await http.post(`${baseUrl}/forgotPassword`, { email });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to send OTP');
    throw error;
  }
};

export const verifyOtpApi = async (email: string, otp: string) => {
  try {
    const response = await http.post(`${baseUrl}/verifyOtp`, { email, otp });
    return response.data;
  } catch (error) {
    handleApiError(error, 'OTP verification failed');
    throw error;
  }
};

export const resetPasswordApi = async (
  email: string,
  password: string,
  passwordConfirm: string
) => {
  try {
    const response = await http.post(`${baseUrl}/resetPassword`, {
      email,
      password,
      passwordConfirm,
    });
    handleApiSuccess('Password reset successfully');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Password reset failed');
    throw error;
  }
};

export const updatePasswordApi = async (
  passwordCurrent: string,
  password: string,
  passwordConfirm: string
) => {
  try {
    const response = await http.patch(`${baseUrl}/updatePassword`, {
      passwordCurrent,
      password,
      passwordConfirm,
    });
    handleApiSuccess('Password updated successfully');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Password update failed');
    throw error;
  }
};
