'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  AlertCircle,
  Edit3,
  Lock,
  Save,
  Settings,
  Shield,
  User,
  X,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import {
  Alert,
  AlertDescription,
  ErrorComponent,
  LoadingSkeleton,
} from '@/components/common';
import { PasswordInput } from '@/components/custom/password-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { updatePasswordApi } from '@/services/apis/auth.api';
import {
  type PasswordFormData,
  passwordSchema,
  type ProfileFormData,
  profileSchema,
} from '@/validations/profile.schema';

import ProfileCard from './ProfileCard';
import ProfileLayout from './ProfileLayout';

const ProfilePage: React.FC = () => {
  const {
    user,
    status,
    error,
    isUploadingPhoto,
    uploadPhoto,
    updateUserProfile,
    clearError,
  } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Memoized default values to prevent unnecessary re-renders
  const profileDefaultValues = useMemo(
    () => ({
      name: user?.name || '',
      phone: user?.phone || '',
      department: user?.department || '',
      specialization: user?.specialization || '',
      experience: user?.experience || '',
    }),
    [user]
  );

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: profileDefaultValues,
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Watch for form changes to show unsaved changes warning
  const watchedValues = profileForm.watch();

  useEffect(() => {
    if (isEditing) {
      const hasChanges = Object.keys(watchedValues).some(
        (key) =>
          watchedValues[key as keyof ProfileFormData] !==
          profileDefaultValues[key as keyof ProfileFormData]
      );
      setHasUnsavedChanges(hasChanges);
    }
  }, [watchedValues, profileDefaultValues, isEditing]);

  // Memoized handlers to prevent unnecessary re-renders
  const handlePhotoUpload = useCallback(
    async (file: File) => {
      try {
        await uploadPhoto(file);
      } catch (error) {
        // Error handling is done in the hook
        console.error('Photo upload failed:', error);
      }
    },
    [uploadPhoto]
  );

  const handleProfileUpdate = useCallback(
    async (data: ProfileFormData) => {
      const success = await updateUserProfile(data);
      if (success) {
        setIsEditing(false);
        setHasUnsavedChanges(false);
      }
    },
    [updateUserProfile]
  );

  const handlePasswordUpdate = useCallback(
    async (data: PasswordFormData) => {
      try {
        setIsUpdatingPassword(true);
        await updatePasswordApi(
          data.currentPassword,
          data.newPassword,
          data.confirmPassword
        );
        toast.success('Password updated successfully');
        passwordForm.reset();
      } catch (error: unknown) {
        console.error('Password update failed:', error);
        const errorMessage =
          (
            error as {
              response?: { data?: { message?: string } };
              message?: string;
            }
          )?.response?.data?.message ||
          (error as { message?: string })?.message ||
          'Failed to update password. Please try again.';
        toast.error(errorMessage);
      } finally {
        setIsUpdatingPassword(false);
      }
    },
    [passwordForm]
  );

  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      if (hasUnsavedChanges) {
        const confirmed = window.confirm(
          'You have unsaved changes. Are you sure you want to cancel?'
        );
        if (!confirmed) return;
      }
      profileForm.reset(profileDefaultValues);
      setHasUnsavedChanges(false);
    }
    setIsEditing(!isEditing);
  }, [isEditing, hasUnsavedChanges, profileForm, profileDefaultValues]);

  const handleRetry = useCallback(() => {
    clearError();
    window.location.reload();
  }, [clearError]);

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset(profileDefaultValues);
      setHasUnsavedChanges(false);
    }
  }, [user, profileForm, profileDefaultValues]);

  // Loading state component
  if (status === 'loading' && !user) {
    return (
      <ProfileLayout>
        <LoadingSkeleton />
      </ProfileLayout>
    );
  }

  // Error state component
  if (error && !user) {
    return (
      <ProfileLayout>
        <ErrorComponent error={error} onRetry={handleRetry} />
      </ProfileLayout>
    );
  }

  // User not found state
  if (!user) {
    return (
      <ProfileLayout>
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            Unable to load profile data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout>
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        {/* Profile Card - Left Side */}
        <div className="lg:col-span-1 xl:col-span-1">
          <ProfileCard
            user={user}
            isUploadingPhoto={isUploadingPhoto}
            onPhotoUpload={handlePhotoUpload}
            editable={true}
          />
        </div>

        {/* Profile Content - Right Side */}
        <div className="lg:col-span-2 xl:col-span-3">
          <Card className="border-white/20 bg-white/80 shadow-xl backdrop-blur-xs">
            <CardHeader>
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Settings className="size-4 sm:size-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Update your personal information and security settings
                  </CardDescription>
                </div>

                {activeTab === 'personal' && (
                  <Button
                    onClick={handleEditToggle}
                    variant={isEditing ? 'outline-solid' : 'default'}
                    className={
                      isEditing
                        ? 'border-red-300 text-red-600 hover:bg-red-50'
                        : 'bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                    }
                    disabled={status === 'loading'}
                    size="sm"
                  >
                    {isEditing ? (
                      <>
                        <X className="mr-2 size-4" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit3 className="mr-2 size-4" />
                        Edit
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger
                    value="personal"
                    className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
                  >
                    <User className="size-3 sm:size-4" />
                    <span className="hidden sm:inline">Personal Info</span>
                    <span className="sm:hidden">Personal</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="flex items-center gap-1 text-xs sm:gap-2 sm:text-sm"
                  >
                    <Lock className="size-3 sm:size-4" />
                    <span className="hidden sm:inline">Update Password</span>
                    <span className="sm:hidden">Password</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="personal"
                  className="mt-4 space-y-4 sm:mt-6 sm:space-y-6"
                >
                  <Form {...profileForm}>
                    <form
                      onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">
                                Full Name *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  className="h-10 border-2 border-gray-200 bg-white/70 text-sm transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed sm:h-12 sm:text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <label
                            htmlFor="email-input"
                            className="text-sm font-medium text-gray-700 sm:text-base"
                          >
                            Email Address
                          </label>
                          <Input
                            id="email-input"
                            value={user.email}
                            disabled
                            readOnly
                            className="h-10 cursor-not-allowed border-2 border-gray-200 bg-gray-50 text-sm text-gray-600 sm:h-12 sm:text-base"
                          />
                          <p className="text-xs text-gray-500 sm:text-sm">
                            <span className="text-amber-600">⚠️</span> Email
                            cannot be changed for security reasons
                          </p>
                        </div>

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="Enter your phone number"
                                  className="h-10 border-2 border-gray-200 bg-white/70 text-sm transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed sm:h-12 sm:text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">
                                Department
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="Enter your department"
                                  className="h-10 border-2 border-gray-200 bg-white/70 text-sm transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed sm:h-12 sm:text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="specialization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">
                                Specialization
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="Enter your specialization"
                                  className="h-10 border-2 border-gray-200 bg-white/70 text-sm transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed sm:h-12 sm:text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">
                                Experience
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing}
                                  placeholder="Years of experience"
                                  className="h-10 border-2 border-gray-200 bg-white/70 text-sm transition-all duration-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed sm:h-12 sm:text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {isEditing && (
                        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
                          <Button
                            type="submit"
                            disabled={status === 'loading'}
                            className="h-10 w-full bg-linear-to-r from-green-500 to-emerald-600 text-sm text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:size-auto sm:text-base"
                          >
                            {status === 'loading' ? (
                              <>
                                <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 size-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleEditToggle}
                            disabled={status === 'loading'}
                            className="h-10 w-full border-2 border-gray-200 bg-white/70 text-sm transition-all duration-300 hover:border-gray-300 hover:bg-white/90 disabled:opacity-50 sm:size-auto sm:text-base"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent
                  value="password"
                  className="mt-4 space-y-4 sm:mt-6 sm:space-y-6"
                >
                  <Form {...passwordForm}>
                    <form
                      onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}
                      className="space-y-4 sm:space-y-6"
                    >
                      <div className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">
                                Current Password *
                              </FormLabel>
                              <FormControl>
                                <PasswordInput
                                  {...field}
                                  placeholder="Enter your current password"
                                  className="h-10 border-2 border-gray-200 bg-white/70 text-sm transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 sm:h-12 sm:text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">
                                New Password *
                              </FormLabel>
                              <FormControl>
                                <PasswordInput
                                  {...field}
                                  placeholder="Enter your new password"
                                  className="h-10 border-2 border-gray-200 bg-white/70 text-sm transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 sm:h-12 sm:text-base"
                                />
                              </FormControl>
                              <FormMessage />
                              <div className="mt-2 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
                                Password must contain at least 8 characters with
                                uppercase, lowercase, number, and special
                                character.
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm sm:text-base">
                                Confirm New Password *
                              </FormLabel>
                              <FormControl>
                                <PasswordInput
                                  {...field}
                                  placeholder="Confirm your new password"
                                  className="h-10 border-2 border-gray-200 bg-white/70 text-sm transition-all duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 sm:h-12 sm:text-base"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="h-10 w-full bg-linear-to-r from-purple-500 to-pink-600 text-sm text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-600 hover:to-pink-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:size-auto sm:text-base"
                      >
                        {isUpdatingPassword ? (
                          <>
                            <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 size-4" />
                            Update Password
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default React.memo(ProfilePage);
