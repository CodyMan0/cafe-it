"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCafe, getSeatsAvailability, updateSeatsAvailability } from "../api";
import { CafeInfo, SeatAvailability } from "../types";
import {
  formatRelativeTime,
  seatStatusColor,
  seatStatusText,
  displayCafeId,
} from "../utils";

export default function Mainboard({
  cafeId,
  onLogout,
}: {
  cafeId: string;
  onLogout: () => void;
}) {
  const [cafeInfo, setCafeInfo] = useState<CafeInfo | null>(null);
  const [seatAvailability, setSeatAvailability] =
    useState<SeatAvailability | null>(null);
  const [lastUpdated, setLastUpdated] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState<string>("");

  useEffect(() => {
    const fetchCafeData = async () => {
      try {
        setIsLoading(true);
        const cafe = await getCafe(cafeId);
        setCafeInfo(cafe);
        const seats = await getSeatsAvailability(cafeId);
        setSeatAvailability(seats);
        setLastUpdated(formatRelativeTime(seats.lastUpdated, currentTime));
        setCurrentTime(new Date());
      } catch (err) {
        console.error("Error fetching cafe data:", err);
        setError("카페 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCafeData();
  }, [cafeId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000); // update every 1 minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setLastUpdated(
      formatRelativeTime(seatAvailability?.lastUpdated || "", currentTime)
    );
  }, [currentTime]);

  const updateSeatAvailability = async (availableSeats: number) => {
    if (!seatAvailability) return;
    setIsUpdating(true);
    try {
      const updated = await updateSeatsAvailability(cafeId, availableSeats);
      setSeatAvailability(updated);
      setLastUpdated(formatRelativeTime(updated.lastUpdated, currentTime));
    } catch (err) {
      console.error("Error updating seat availability:", err);
      setError("자리 상태 업데이트에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const copyCafeId = async () => {
    try {
      await navigator.clipboard.writeText(cafeInfo!.id);
      setCopyStatus("복사됨!");
      setTimeout(() => setCopyStatus(""), 1500);
    } catch {
      setCopyStatus("복사 실패");
      setTimeout(() => setCopyStatus(""), 1500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">카페 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !cafeInfo || !seatAvailability) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "카페 정보를 불러올 수 없습니다."}
          </p>
          <button
            onClick={onLogout}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4">
      <main className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {cafeInfo.name}
            </h1>
            <p className="text-gray-600 mb-4">카페 관리 대시보드</p>
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full ${seatStatusColor(
                seatAvailability.availableSeats
              )}`}
            >
              <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
              <span className="font-medium">
                {seatStatusText(seatAvailability.availableSeats)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🪑 자리 현황 업데이트
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            현재 카페의 자리 상황을 선택해주세요
          </p>

          <div className="space-y-3">
            <button
              onClick={() => updateSeatAvailability(2)}
              disabled={isUpdating}
              className={`w-full p-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-3 ${
                seatAvailability.availableSeats === 2
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>자리 많음</span>
              {seatAvailability.availableSeats === 2 && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={() => updateSeatAvailability(1)}
              disabled={isUpdating}
              className={`w-full p-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-3 ${
                seatAvailability.availableSeats === 1
                  ? "bg-yellow-500 text-white shadow-lg"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <span>자리 있음</span>
              {seatAvailability.availableSeats === 1 && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>

            <button
              onClick={() => updateSeatAvailability(0)}
              disabled={isUpdating}
              className={`w-full p-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-3 ${
                seatAvailability.availableSeats === 0
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>자리 없음</span>
              {seatAvailability.availableSeats === 0 && (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>

          {isUpdating && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">업데이트 중...</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            카페 정보
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">카페 ID</span>
              <div className="flex items-center space-x-2">
                <span
                  className="font-medium text-gray-800 text-sm select-all"
                  title={cafeInfo.id}
                >
                  {displayCafeId(cafeInfo.id)}
                </span>
                <button
                  onClick={copyCafeId}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                  title="클립보드에 복사"
                >
                  복사
                </button>
              </div>
            </div>
            {copyStatus && (
              <div className="p-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded">
                {copyStatus} - 분실 시 재로그인을 위해 꼭 보관해 주세요.
              </div>
            )}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">마지막 업데이트</span>
              <span className="font-medium text-gray-800">{lastUpdated}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Google 지도</span>
              <a
                href={cafeInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium hover:underline"
              >
                보기
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-gray-600 text-white p-4 rounded-xl font-medium text-center hover:shadow-lg transition-all"
          >
            고객 페이지로 돌아가기
          </Link>
          <button
            onClick={onLogout}
            className="w-full bg-red-500 text-white p-4 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            로그아웃
          </button>
        </div>
      </main>
    </div>
  );
}
