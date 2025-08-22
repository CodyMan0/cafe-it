import { useQuery } from "@tanstack/react-query";

import { CustomResponse } from "../(http-client)/http-client";
import { httpClient } from "../(http-client)";
import { ErrorResponse } from "../common.dto";

// API 요청 파라미터 타입
interface GetCafesParams {
  lat: number;
  lng: number;
  radius: number;
}

export interface CafeResponse {
  id: string;
  name: string;
  lat: number;
  lng: number;
  totalSeats: number;
  availableSeats: number;
  lastUpdated: string;
  url: string;
  isManualMonitoring?: boolean;
}

async function getCafes(params: GetCafesParams) {
  const result = await httpClient.get<CafeResponse[]>("api/cafes", params);

  if (result.status >= 400) {
    throw result as unknown as ErrorResponse;
  }

  return result as CustomResponse<CafeResponse[]>;
}

export function useGetCafesQuery(
  params: GetCafesParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ["cafes", params.lat, params.lng, params.radius],
    queryFn: () => getCafes(params),
    enabled: options?.enabled ?? true, // 쿼리를 조건부로 실행할 수 있도록 enabled 옵션 추가
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
