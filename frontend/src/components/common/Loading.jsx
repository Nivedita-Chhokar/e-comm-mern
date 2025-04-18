import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      <p className="ml-4 text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default Loading;