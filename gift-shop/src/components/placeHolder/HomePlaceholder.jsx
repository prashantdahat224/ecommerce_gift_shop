 import React from "react";

const HomePlaceholder = () => {
  // Skeleton for header
  const HeaderSkeleton = () => (
    <div className="bg-gray-200 h-12 w-full animate-pulse mb-2"></div>
  );

  // Skeleton for search bar
  const SearchBarSkeleton = () => (
    <div className="bg-gray-200 h-10 w-full rounded animate-pulse mb-4"></div>
  );

  // Skeleton for offer poster
  const OfferPosterSkeleton = () => (
    <div className="bg-gray-200 h-40 w-full rounded animate-pulse mb-4"></div>
  );

  // Skeleton for a single product card
  const ProductSkeleton = () => (
    <div className="rounded p-2 animate-pulse">
      <div className="bg-gray-200 h-32 w-full rounded mb-2"></div>
      <div className="bg-gray-200 h-4 w-3/4 mb-1"></div>
      <div className="bg-gray-200 h-3 w-1/2"></div>
    </div>
  );

  // Skeleton for bottom navigation
  const BottomNavSkeleton = () => (
    <div className="bg-gray-200 h-16 w-full animate-pulse mt-4"></div>
  );

  return (
    <div className="bg-white min-h-screen pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <HeaderSkeleton />

      {/* Search Bar */}
      <SearchBarSkeleton />

      {/* Offer Poster */}
      <OfferPosterSkeleton />

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductSkeleton key={idx} />
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavSkeleton />
    </div>
  );
};

export default HomePlaceholder;
