"use client";

import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api";
import { useMemo } from "react";
import CafeMarker from "./CafeMarker";

export interface Cafe {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  availableSeats: number;
  totalSeats: number;
  isManualMonitoring?: boolean;
}

interface GoogleMapProps {
  cafes: Cafe[];
  initialCenter: {
    lat: number;
    lng: number;
  };
  radius?: number;
}

const GoogleMapComponent = ({
  cafes,
  initialCenter,
  radius,
}: GoogleMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
    }),
    []
  );

  const circleOptions = useMemo(
    () => ({
      strokeColor: "#4A90E2",
      strokeOpacity: 0.2,
      strokeWeight: 2,
      fillColor: "#4A90E2",
      fillOpacity: 0.2,
      clickable: false,
      draggable: false,
      editable: false,
      visible: true,
      zIndex: 1,
    }),
    []
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        지도 로딩 중...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={initialCenter}
      zoom={15}
      options={{ disableDefaultUI: true }}
    >
      {cafes.map((cafe) => {
        console.log(cafe);
        return (
          <CafeMarker key={cafe.id} position={cafe.position} cafeInfo={cafe} />
        );
      })}
      {radius && (
        <Circle
          center={initialCenter}
          radius={radius}
          options={circleOptions}
        />
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
