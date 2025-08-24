'use client';

import { Award, Building, Camera, Clock, Mail, Phone } from 'lucide-react';
import React, { useRef } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { User as UserType } from '@/constants/interface.constant';

interface ProfileCardProps {
  user: UserType;
  isUploadingPhoto: boolean;
  onPhotoUpload: (file: File) => void;
  editable?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  isUploadingPhoto,
  onPhotoUpload,
  editable = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoUpload(file);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'consultant':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="border-white/20 bg-white/80 shadow-xl backdrop-blur-xs">
      <CardHeader className="relative pb-4 text-center">
        <div className="relative inline-block">
          <Avatar className="mx-auto size-24 border-4 border-white shadow-lg sm:size-32">
            <AvatarImage src={user.photo} alt={user.name} />
            <AvatarFallback className="bg-linear-to-br from-blue-400 to-purple-500 text-lg text-white sm:text-2xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          {editable && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute bottom-0 right-0 rounded-full bg-linear-to-r from-blue-500 to-purple-600 p-2 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 sm:p-3"
              title="Upload new photo"
            >
              {isUploadingPhoto ? (
                <div className="size-4 animate-spin rounded-full border-b-2 border-white sm:size-5"></div>
              ) : (
                <Camera className="size-4 sm:size-5" />
              )}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        <div className="mt-4 space-y-2 sm:mt-6 sm:space-y-3">
          <h2 className="break-words text-xl font-bold text-gray-900 sm:text-2xl">
            {user.name}
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge
              className={`${getRoleColor(user.role)} border text-xs sm:text-sm`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
            {user.status && (
              <Badge
                variant={user.status === 'active' ? 'default' : 'secondary'}
                className="text-xs sm:text-sm"
              >
                {user.status}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:space-y-4 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 sm:gap-3 sm:p-3">
            <Mail className="size-4 shrink-0 text-gray-600 sm:size-5" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-gray-600 sm:text-sm">Email</p>
              <p className="break-words text-sm font-medium text-gray-900 sm:text-base">
                {user.email}
              </p>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 sm:gap-3 sm:p-3">
              <Phone className="size-4 shrink-0 text-gray-600 sm:size-5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600 sm:text-sm">Phone</p>
                <p className="text-sm font-medium text-gray-900 sm:text-base">
                  {user.phone}
                </p>
              </div>
            </div>
          )}

          {user.department && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 sm:gap-3 sm:p-3">
              <Building className="size-4 shrink-0 text-gray-600 sm:size-5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600 sm:text-sm">Department</p>
                <p className="text-sm font-medium text-gray-900 sm:text-base">
                  {user.department}
                </p>
              </div>
            </div>
          )}

          {user.specialization && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 sm:gap-3 sm:p-3">
              <Award className="size-4 shrink-0 text-gray-600 sm:size-5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600 sm:text-sm">
                  Specialization
                </p>
                <p className="text-sm font-medium text-gray-900 sm:text-base">
                  {user.specialization}
                </p>
              </div>
            </div>
          )}

          {user.experience && (
            <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2 sm:gap-3 sm:p-3">
              <Clock className="size-4 shrink-0 text-gray-600 sm:size-5" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600 sm:text-sm">Experience</p>
                <p className="text-sm font-medium text-gray-900 sm:text-base">
                  {user.experience}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-3 sm:pt-4">
          <div className="flex justify-between text-xs text-gray-500 sm:text-sm">
            <span>Member since</span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="mt-1 flex justify-between text-xs text-gray-500 sm:text-sm">
            <span>Last updated</span>
            <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ProfileCard);
