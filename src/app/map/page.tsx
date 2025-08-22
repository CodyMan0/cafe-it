"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import MobileBar from "@/features/ui/MobileBar";
import GoogleMapComponent, { Bounds } from "@/features/ui/GoogleMap";
import { CafeResponse, useGetCafesQuery } from "../apis/map/useGetCafesQuery";
import CafeList from "./(components)/CafeList";
import { CafeInfoSheet } from "@/features/ui/CafeInfoSheet";
import { throttle } from "lodash";
import LoadingDots from "./(components)/LoadingDot";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ErrorResponse } from "../apis/common.dto";

// Haversine formula to calculate distance between two points
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Normalize functions for caching
const normalizeCoord = (coord: number) => Math.round(coord * 1000) / 1000; // ~111m precision
const normalizeRadius = (radius: number) => Math.round(radius / 0.1) * 0.1; // 100m steps

export default function MapPage() {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<{
    lat: number;
    lng: number;
    radius: number;
  } | null>(null);
  const [isRadiusError, setIsRadiusError] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<CafeResponse | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleCafeSelect = (cafe: CafeResponse) => {
    setSelectedCafe(cafe);
    setIsSheetOpen(true);
  };

  // 1. Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const initialLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(initialLocation);
          // Set initial search parameters (default radius 1km)
          setSearchParams({ ...initialLocation, radius: 1 });
        },
        (error) => {
          setLocationError(
            "Location access denied. Please check your browser settings."
          );
          console.error("Error getting current location: ", error);
        }
      );
    } else {
      setLocationError("This browser does not support location information.");
    }
  }, []);

  // 2. Call cafe data API based on search parameters
  const {
    data: cafesData,
    isLoading,
    isError,
    error,
  } = useGetCafesQuery(
    {
      lat: searchParams?.lat ?? 0,
      lng: searchParams?.lng ?? 0,
      radius: searchParams?.radius ?? 0,
    },
    {
      enabled: !!searchParams,
    }
  );

  useEffect(() => {
    if (isError && error) {
      // A more specific error check would be better if the API provides a specific error code
      if ((error as ErrorResponse).message?.includes("Radius is too large")) {
        setIsRadiusError(true);
      } else {
        setIsRadiusError(false);
      }
    }
  }, [isError, error]);

  // 3. Process data into a format to be passed to the map component
  const mapCafes = useMemo(() => {
    if (!cafesData?.data) return [];
    return cafesData.data.map((cafe) => ({
      ...cafe,
      position: { lat: cafe.lat, lng: cafe.lng },
    }));
  }, [cafesData]);

  const handleBoundsChange = useCallback((bounds: Bounds) => {
    const centerLat = (bounds.neLat + bounds.swLat) / 2;
    const centerLng = (bounds.neLng + bounds.swLng) / 2;
    const radius = getDistance(
      centerLat,
      centerLng,
      bounds.neLat,
      bounds.neLng
    );

    const normalizedLat = normalizeCoord(centerLat);
    const normalizedLng = normalizeCoord(centerLng);
    const normalizedRadius = normalizeRadius(Math.max(radius, 0.1)); // Minimum radius 100m

    setSearchParams({
      lat: normalizedLat,
      lng: normalizedLng,
      radius: normalizedRadius,
    });
  }, []);

  // Create throttled function
  const throttledBoundsChange = useMemo(
    () => throttle(handleBoundsChange, 1000),
    [handleBoundsChange]
  );

  const handleResetRadius = () => {
    if (currentLocation) {
      setSearchParams({ ...currentLocation, radius: 1 });
      setIsRadiusError(false);
    }
  };

  if (locationError) {
    return <div>{locationError}</div>;
  }

  if (!currentLocation) {
    return <div>Getting current location...</div>;
  }

  return (
    <main className="relative flex flex-col h-screen pb-16">
      <div className="flex-1 relative">
        <GoogleMapComponent
          cafes={mapCafes}
          initialCenter={currentLocation}
          onBoundsChange={throttledBoundsChange}
          onMarkerClick={handleCafeSelect}
        />
      </div>

      <div className="min-h-[30vh] overflow-y-auto p-4">
        {isLoading ? (
          <LoadingDots />
        ) : isRadiusError ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                The search radius is too large.
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Please search with a smaller radius.
              </p>
            </div>
            <Button
              onClick={handleResetRadius}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Radius</span>
            </Button>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Could not load data
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Please try again in a moment
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </Button>
          </div>
        ) : (
          <CafeList cafes={mapCafes} onCafeClick={handleCafeSelect} />
        )}
      </div>

      {selectedCafe && (
        <CafeInfoSheet
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          cafeInfo={selectedCafe}
        />
      )}

      <MobileBar />
    </main>
  );
}
