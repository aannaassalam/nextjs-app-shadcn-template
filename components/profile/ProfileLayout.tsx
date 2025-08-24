'use client';

import React from 'react';

import AppLayout from '@/components/layout/AppLayout';

interface ProfileLayoutProps {
  children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
  return (
    <AppLayout>
      <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4 sm:py-6 lg:p-8">
          {children}
        </div>
      </div>
    </AppLayout>
  );
};

export default React.memo(ProfileLayout);
