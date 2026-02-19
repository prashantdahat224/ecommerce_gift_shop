import React from "react";

const EditProfileSkeleton = () => {
  return (
    <div>
      {/* Header */}
      <h1 className="flex items-center gap-3 text-left text-lg font-medium text-gray-900 my-2 ml-4">
        <div className="h-10 w-10 bg-gray-300 rounded animate-pulse" />
        <div className="h-6 w-32 bg-gray-300 rounded animate-pulse" />
      </h1>

      <hr className="border-gray-300" />

      {/* Card */}
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
        {/* Name Field Skeleton */}
        <label className="mt-5 block mb-4">
          <span className="text-gray-700">Name</span>
          <div className="mt-1 h-10 w-full bg-gray-200 rounded animate-pulse" />
        </label>

        {/* Phone Number Field Skeleton */}
        <label className="block mb-4">
          <span className="text-gray-700">Phone Number</span>
          <div className="mt-1 h-10 w-full bg-gray-200 rounded animate-pulse" />
        </label>

        {/* Save Button Skeleton */}
        <div className="h-10 w-full bg-gray-300 rounded-xl animate-pulse" />

        {/* Message Skeleton */}
        <div className="mt-4 h-4 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

export default EditProfileSkeleton;
