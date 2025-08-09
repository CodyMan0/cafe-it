import { CafeResponse } from "@/app/apis/map/useGetCafesQuery";
import React from "react";

const CafeList = ({ cafes }: { cafes: CafeResponse[] }) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-medium text-gray-900 mb-3">주변 카페 현황</h3>
      <div className="space-y-3">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{cafe.name}</p>
              {/* <p className="text-xs text-gray-500">{cafe.address}</p> */}
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-medium ${
                  cafe.availableSeats > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {cafe.availableSeats > 0 ? "자리 있음" : "자리 없음"}
              </p>
              <p className="text-xs text-gray-500">
                {cafe.availableSeats}/{cafe.totalSeats}석
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CafeList;
