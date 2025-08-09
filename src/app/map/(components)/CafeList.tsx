import { CafeResponse } from "@/app/apis/map/useGetCafesQuery";
import React from "react";
import { Users, Clock } from "lucide-react";

const CafeList = ({ cafes }: { cafes: CafeResponse[] }) => {
  const getSeatStatusColor = (availableSeats: number, totalSeats: number) => {
    const ratio = availableSeats / totalSeats;
    if (ratio === 0) return "bg-red-100 text-red-700 border-red-200";
    if (ratio < 0.3) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-green-100 text-green-700 border-green-200";
  };

  const getSeatStatusText = (availableSeats: number, totalSeats: number) => {
    const ratio = availableSeats / totalSeats;
    if (ratio === 0) return "자리 없음";
    if (ratio < 0.3) return "자리 있음";
    return "자리 많음";
  };

  return (
    <div className="bg-white border-t border-gray-200 max-h-64 overflow-y-auto pt-4">
      <div className="space-y-4">
        {cafes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">주변에 카페가 없습니다</p>
          </div>
        ) : (
          cafes.map((cafe) => (
            <div
              key={cafe.id}
              className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:border-primary-100 transition-all duration-200 cursor-pointer"
            >
              <span
                className={`absolute top-4 right-4 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getSeatStatusColor(
                  cafe.availableSeats,
                  cafe.totalSeats
                )}`}
              >
                {getSeatStatusText(cafe.availableSeats, cafe.totalSeats)}
              </span>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="w-[70%] text-base font-semibold text-gray-900 truncate">
                      {cafe.name}
                    </h3>
                    {/* {cafe.isManualMonitoring && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 shrink-0">
                        수동
                      </span>
                    )} */}
                  </div>

                  <div className="flex items-end justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Users className="w-4 h-4 shrink-0" />
                        <span>{cafe.totalSeats}석</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span className="text-xs">
                          {new Date(cafe.lastUpdated).toLocaleTimeString(
                            "ko-KR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {cafe.availableSeats}/{cafe.totalSeats}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CafeList;
