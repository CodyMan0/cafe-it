"use client";

import MobileBar from "@/features/ui/MobileBar";

export default function SearchPage() {
  return (
    <main className="relative flex flex-col h-screen pb-16">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        {/* Cute search icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative inline-block">
            <svg
              className="w-20 h-20 sm:w-24 sm:h-24 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {/* Add cute eyes - centered position */}
            <div className="absolute top-7 left-7 sm:top-9 sm:left-7 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="absolute top-7 right-7 sm:top-9 sm:right-11 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Message */}
        <div className="text-center max-w-sm mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
            Search Function
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-4">
            Coming soon! 🚀
          </p>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            You&apos;ll be able to experience a great search function soon
          </p>
        </div>
      </div>
      <MobileBar />
    </main>
  );
}
