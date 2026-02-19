function PlaceholderAccount() {
  return (
    <div className="bg-white min-h-screen flex flex-col"> {/*animate-pulse*/}
      
      <div className="flex-1 overflow-y-auto">

        {/* Header Skeleton */}
        <header className="flex items-center h-14 px-4 border-b border-gray-200">
          <div className="h-8 w-8 bg-gray-300 rounded-md"></div>
          <div className="ml-3 h-4 w-24 bg-gray-300 rounded"></div>
        </header>

        {/* Greeting Skeleton */}
        <div className="mt-6 ml-4">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>

        {/* Menu Buttons Skeleton */}
        <div className="grid grid-cols-2 gap-4 px-6 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center border border-gray-300 rounded-md py-3"
            >
              <div className="h-6 w-6 bg-gray-300 rounded-full mb-2"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Profile Section Skeleton */}
        <div className="ml-4 flex space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gray-300 rounded-full"></div>

          <div className="flex flex-col space-y-6 flex-1">
            {/* Name */}
            <div>
              <div className="h-4 w-40 bg-gray-300 rounded"></div>
              <hr className="border-gray-300 mt-2 w-40" />
            </div>

            {/* Number */}
            <div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <hr className="border-gray-300 mt-2 w-32" />
            </div>

            {/* Edit Profile Button */}
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Admin Panel Skeleton (space reserved) */}
        <div className="px-6">
          <div className="h-5 w-40 bg-gray-300 rounded mb-3"></div>
          <div className="h-16 bg-gray-300 rounded"></div>
        </div>

      </div>

      {/* Bottom Navigation Placeholder */}
      <div className="h-16 border-t border-gray-200 bg-gray-100"></div>
    </div>
  );
}

export default PlaceholderAccount;
