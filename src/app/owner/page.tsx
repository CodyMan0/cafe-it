"use client";

import { useEffect, useState } from "react";
import Mainboard from "./_components/Mainboard";
import RegisterForm from "./_components/RegisterForm";

export default function OwnerPage() {
  const [cafeId, setCafeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCafeId = localStorage.getItem("cafeId");
    if (storedCafeId) setCafeId(storedCafeId);
    setIsLoading(false);
  }, []);

  const handleRegister = (newCafeId: string) => {
    localStorage.setItem("cafeId", newCafeId);
    setCafeId(newCafeId);
  };

  const handleLogout = () => {
    localStorage.removeItem("cafeId");
    setCafeId(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!cafeId) {
    return <RegisterForm onRegister={handleRegister} />;
  }

  return <Mainboard cafeId={cafeId} onLogout={handleLogout} />;
}
