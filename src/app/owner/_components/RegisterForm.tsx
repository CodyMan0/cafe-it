"use client";

import { useState } from "react";
import {
  createCafe,
  extractCoordinatesFromUrl,
  initSeatsAvailability,
  getCafe,
} from "../api";

export default function RegisterForm({
  onRegister,
}: {
  onRegister: (cafeId: string) => void;
}) {
  const [cafeName, setCafeName] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Login by Cafe ID
  const [loginCafeId, setLoginCafeId] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cafeName.trim() || !googleUrl.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const coords = await extractCoordinatesFromUrl(googleUrl.trim());
      const cafe = await createCafe({
        name: cafeName.trim(),
        lat: coords.lat,
        lng: coords.lng,
        totalSeats: 2,
        url: googleUrl.trim(),
      });
      await initSeatsAvailability(cafe.id, 2);
      onRegister(cafe.id);
    } catch (err) {
      console.error("Registration error:", err);
      setError("카페 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginByCafeId = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = loginCafeId.trim();
    if (!trimmed) return;
    setIsLoggingIn(true);
    setLoginError("");
    try {
      // Validate cafe exists
      await getCafe(trimmed);
      onRegister(trimmed);
    } catch (err) {
      console.error("Login by cafeId failed:", err);
      setLoginError("유효하지 않은 카페 ID 입니다. 다시 확인해주세요.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4 flex items-center">
      <main className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">카페 등록</h1>
            <p className="text-gray-600">카페 정보를 입력해주세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카페 이름
              </label>
              <input
                type="text"
                value={cafeName}
                onChange={(e) => setCafeName(e.target.value)}
                placeholder="카페 이름을 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google 지도 URL
              </label>
              <input
                type="url"
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !cafeName.trim() || !googleUrl.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "등록 중..." : "카페 등록하기"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-gray-500 text-sm">또는</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              카페 ID로 로그인
            </h2>
            <form onSubmit={handleLoginByCafeId} className="space-y-3">
              <input
                type="text"
                value={loginCafeId}
                onChange={(e) => setLoginCafeId(e.target.value)}
                placeholder="카페 ID를 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-600"
              />
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{loginError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoggingIn || !loginCafeId.trim()}
                className="w-full bg-gray-700 text-white p-3 rounded-lg font-medium hover:shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? "확인 중..." : "카페 ID로 로그인"}
              </button>
              <p className="text-xs text-gray-500 mt-1">
                이미 등록한 카페가 있다면 카페 ID로 로그인할 수 있어요.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
