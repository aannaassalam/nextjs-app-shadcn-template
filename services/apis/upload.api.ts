import { handleApiError } from '@/utils/apiErrorHandler';

import http from '../http';

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
}

export interface UploadToAWSResponse {
  status: number;
  message: string;
  data: {
    url: string;
  };
}

/**
 * Upload file to AWS S3
 * @param file - File to upload
 * @returns Promise<UploadToAWSResponse>
 */
export const uploadToAWS = async (file: File): Promise<UploadToAWSResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await http.post(
      '/api/v1/uploads/upload-to-azure',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error, 'File upload failed');
    throw error;
  }
};

/**
 * Upload multiple files to AWS S3
 * @param files - Array of files to upload
 * @returns Promise<UploadToAWSResponse[]>
 */
export const uploadMultipleToAWS = async (
  files: File[]
): Promise<UploadToAWSResponse[]> => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await http.post(
      '/api/v1/uploads/upload-multiple-to-aws',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error, 'Multiple file upload failed');
    throw error;
  }
};
