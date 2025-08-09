"use client";

import { useState, useEffect, useMemo } from "react";
import MobileBar from "@/features/ui/MobileBar";
import GoogleMapComponent from "@/features/ui/GoogleMap";
import { useGetCafesQuery } from "../apis/map/useGetCafesQuery";
import CafeList from "./(components)/CafeList";
import { Label } from "@/shared/ui/label";
import { Slider } from "@/shared/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import Image from "next/image";
import { throttle } from "lodash";
import { motion } from "framer-motion";
import LoadingDots from "./(components)/LoadingDot";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function MapPage() {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // API 요청에 사용될 반경 값 (Throttling 적용)
  const [radius, setRadius] = useState(1000);
  // 슬라이더의 시각적 위치를 위한 상태
  const [sliderValue, setSliderValue] = useState(1000);

  // 1. 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError(
            "위치 정보 접근이 거부되었습니다. 브라우저 설정을 확인해주세요."
          );
          console.error("Error getting current location: ", error);
        }
      );
    } else {
      setLocationError("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
    }
  }, []);

  // 2. 현재 위치와 반경을 기반으로 카페 데이터 API 호출
  const {
    data: cafesData,
    isLoading,
    isError,
  } = useGetCafesQuery(
    {
      lat: currentLocation?.lat ?? 0,
      lng: currentLocation?.lng ?? 0,
      radius: radius / 1000, // API가 km 단위를 사용할 경우를 가정하여 변환
    },
    { enabled: !!currentLocation } // 현재 위치가 있을 때만 쿼리 실행
  );

  // 3. 지도 컴포넌트에 전달할 데이터 형태로 가공
  const mapCafes = useMemo(() => {
    if (!cafesData?.data) return [];
    return cafesData.data.map((cafe) => ({
      ...cafe,
      position: { lat: cafe.lat, lng: cafe.lng },
    }));
  }, [cafesData]);

  const displayRadius = useMemo(() => {
    if (sliderValue >= 1000) {
      return `${(sliderValue / 1000).toFixed(1)}km`;
    }
    return `${sliderValue}m`;
  }, [sliderValue]);

  // Throttled 함수 생성 (useMemo 사용)
  const throttledSetRadius = useMemo(
    () =>
      throttle((value) => {
        setRadius(value);
      }, 500),
    []
  );

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
    throttledSetRadius(value[0]);
  };

  // 로딩 및 에러 상태 처리
  if (locationError) {
    return <div>{locationError}</div>;
  }

  if (!currentLocation) {
    return <div>현재 위치를 가져오는 중입니다...</div>;
  }

  return (
    <main className="relative flex flex-col h-screen pb-16">
      <div className="flex-1 relative">
        <GoogleMapComponent
          cafes={mapCafes}
          initialCenter={currentLocation}
          radius={sliderValue} // 시각적 반경은 슬라이더 값을 바로 반영
        />
      </div>

      <div className="absolute bottom-16 left-0 right-0 bg-white p-4 rounded-t-lg shadow-lg">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="radius-slider"
              className="text-sm font-medium text-muted-foreground"
            >
              반경 설정
            </Label>
            <span className="font-semibold text-lg">{displayRadius}</span>
          </div>
          <Slider
            id="radius-slider"
            min={500}
            max={20000}
            step={500}
            value={[sliderValue]}
            onValueChange={handleSliderChange}
          />
        </div>
        <Tabs defaultValue="nearby-cafes" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nearby-cafes">점주 수동 자리 현황</TabsTrigger>
            <TabsTrigger value="seat-status">실시간 자리 현황</TabsTrigger>
          </TabsList>
          <TabsContent
            value="nearby-cafes"
            className="min-h-[30vh] overflow-y-auto"
          >
            {isLoading ? (
              <LoadingDots />
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    데이터를 불러올 수 없습니다
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs">
                    잠시 후 다시 시도해주세요
                  </p>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>다시 시도</span>
                </Button>
              </div>
            ) : (
              <CafeList cafes={mapCafes} />
            )}
          </TabsContent>
          <TabsContent
            value="seat-status"
            className="flex min-h-[30vh] flex-col items-center justify-center"
          >
            <motion.div
              className="flex h-full flex-col"
              animate={{ y: ["-5px", "5px"] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <Image
                src="/icon/pin.svg"
                alt="로고_둥둥_이미지"
                width={100}
                height={100}
              />
            </motion.div>
            <p className="text-sm text-muted-foreground">준비 중입니다.</p>
          </TabsContent>
        </Tabs>
      </div>

      <MobileBar />
    </main>
  );
}
