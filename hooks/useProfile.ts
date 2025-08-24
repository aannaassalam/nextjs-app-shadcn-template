import { useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

export const useProfile = () => {
  const { data: user } = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: () => Promise.resolve({ role: '' }), // Placeholder, replace with actual user fetch if needed
  });

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // const uploadPhoto = async (file: File) => {
  //   if (!user) {
  //     toast.error('User not authenticated');
  //     return;
  //   }

  //   // Validate file type
  //   const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  //   if (!allowedTypes.includes(file.type)) {
  //     toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
  //     return;
  //   }

  //   // Validate file size (max 5MB)
  //   const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  //   if (file.size > maxSize) {
  //     toast.error('Image size must be less than 5MB');
  //     return;
  //   }

  //   setIsUploadingPhoto(true);
  //   try {
  //     const uploadResponse = await uploadToAWS(file);

  //     if (!uploadResponse?.data?.url) {
  //       throw new Error('Invalid upload response');
  //     }

  //     const result = await dispatch(
  //       updateProfile({
  //         id: user._id,
  //         data: {
  //           photo: uploadResponse.data.url,
  //         },
  //       })
  //     );

  //     if (updateProfile.fulfilled.match(result)) {
  //       return uploadResponse.data.url;
  //     } else {
  //       throw new Error(result.payload || 'Failed to update profile');
  //     }
  //   } catch (error) {
  //     console.error('Error uploading photo:', error);
  //     toast.error('Failed to upload photo');
  //     throw error;
  //   } finally {
  //     setIsUploadingPhoto(false);
  //   }
  // };

  // const updateUserProfile = async (data: ProfileFormData) => {
  //   if (!user) {
  //     toast.error('User not authenticated');
  //     return false;
  //   }

  //   if (!data.name) {
  //     toast.error('Name is required');
  //     return false;
  //   }

  //   try {
  //     const result = await dispatch(
  //       updateProfile({
  //         id: user._id,
  //         data,
  //       })
  //     );

  //     if (updateProfile.fulfilled.match(result)) {
  //       return true;
  //     } else {
  //       throw new Error(result.payload || 'Failed to update profile');
  //     }
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     toast.error('Failed to update profile');
  //     return false;
  //   }
  // };

  return {
    user,
    status,
    // error,
    isUploadingPhoto,
    // uploadPhoto,
    // updateUserProfile,
    // clearError: clearProfileError,
  };
};
