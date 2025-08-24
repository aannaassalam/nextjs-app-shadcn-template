import React from 'react';

import {
  useCanAccessAdmin,
  useCanAccessConsultant,
  useHasRole,
  useUserRole,
} from '@/hooks/useUserRole';

/**
 * Example component showing how to use the user role hooks
 * This component demonstrates role-based rendering and access control
 */
const UserRoleExample: React.FC = () => {
  const { userRole, user, isAdmin, isConsultant, isAuthenticated } =
    useUserRole();
  const canAccessAdmin = useCanAccessAdmin();
  const canAccessConsultant = useCanAccessConsultant();
  const hasMultipleRoles = useHasRole(['admin', 'consultant']);

  if (!isAuthenticated) {
    return <div>Please log in to view this content.</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-4 text-2xl font-bold">User Role Information</h2>

      <div className="mb-4 rounded-lg bg-gray-100 p-4">
        <h3 className="mb-2 font-semibold">Current User Details:</h3>
        <p>
          <strong>Name:</strong> {user?.name}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> {userRole}
        </p>
        <p>
          <strong>Status:</strong> {user?.status || 'active'}
        </p>
      </div>

      <div className="mb-4 rounded-lg bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold">Role Checks:</h3>
        <div className="space-y-1">
          <p>
            Is Admin:{' '}
            <span className={isAdmin ? 'text-green-600' : 'text-red-600'}>
              {isAdmin ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            Is Consultant:{' '}
            <span className={isConsultant ? 'text-green-600' : 'text-red-600'}>
              {isConsultant ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            Can Access Admin Routes:{' '}
            <span
              className={canAccessAdmin ? 'text-green-600' : 'text-red-600'}
            >
              {canAccessAdmin ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            Can Access Consultant Routes:{' '}
            <span
              className={
                canAccessConsultant ? 'text-green-600' : 'text-red-600'
              }
            >
              {canAccessConsultant ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            Has Multiple Roles:{' '}
            <span
              className={hasMultipleRoles ? 'text-green-600' : 'text-red-600'}
            >
              {hasMultipleRoles ? 'Yes' : 'No'}
            </span>
          </p>
        </div>
      </div>

      {/* Role-based content rendering */}
      {isAdmin && (
        <div className="mb-4 rounded-lg bg-red-50 p-4">
          <h3 className="mb-2 font-semibold text-red-700">
            Admin Only Content
          </h3>
          <p>This content is only visible to admin users.</p>
          <ul className="mt-2 list-inside list-disc">
            <li>Manage Users</li>
            <li>System Settings</li>
            <li>Analytics Dashboard</li>
          </ul>
        </div>
      )}

      {isConsultant && (
        <div className="mb-4 rounded-lg bg-green-50 p-4">
          <h3 className="mb-2 font-semibold text-green-700">
            Consultant Only Content
          </h3>
          <p>This content is only visible to consultant users.</p>
          <ul className="mt-2 list-inside list-disc">
            <li>Patient Records</li>
            <li>Treatment Plans</li>
            <li>Appointment Management</li>
          </ul>
        </div>
      )}

      {(isAdmin || isConsultant) && (
        <div className="rounded-lg bg-purple-50 p-4">
          <h3 className="mb-2 font-semibold text-purple-700">
            Common Protected Content
          </h3>
          <p>This content is visible to both admin and consultant users.</p>
          <ul className="mt-2 list-inside list-disc">
            <li>Dashboard</li>
            <li>Profile Settings</li>
            <li>General Settings</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserRoleExample;
