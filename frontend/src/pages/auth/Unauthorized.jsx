import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Unauthorized = () => {
  const { currentUser, isAdmin, isRider } = useAuth();
  
  // Determine where to redirect based on user role
  const getRedirectPath = () => {
    if (!currentUser) return '/login';
    if (isAdmin()) return '/admin/dashboard';
    if (isRider()) return '/rider/dashboard';
    return '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-24 w-24 text-red-500 mx-auto"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4V9m0 0V7m0 2h2M9 9h2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" 
          />
        </svg>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h2>
        <p className="mt-2 text-lg text-gray-600">
          You don't have permission to access this page.
        </p>
        <div className="mt-8">
          <Link
            to={getRedirectPath()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to {currentUser ? 'Dashboard' : 'Login'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;