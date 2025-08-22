"use client";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useMemo, useState, useCallback } from "react";
import CafeMarker from "./CafeMarker";
import { CafeResponse } from "@/app/apis/map/useGetCafesQuery";

export interface Bounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

interface GoogleMapProps {
  cafes: CafeResponse[];
  initialCenter: {
    lat: number;
    lng: number;
  };
  onBoundsChange: (bounds: Bounds) => void;
  onMarkerClick: (cafe: CafeResponse) => void;
}

const GoogleMapComponent = ({
  cafes,
  initialCenter,
  onBoundsChange,
  onMarkerClick,
}: GoogleMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const containerStyle = useMemo(
    () => ({
      width: "100%",
      height: "100%",
    }),
    []
  );

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onIdle = () => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        onBoundsChange({
          neLat: ne.lat(),
          neLng: ne.lng(),
          swLat: sw.lat(),
          swLng: sw.lng(),
        });
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={initialCenter}
      zoom={15}
      options={{ disableDefaultUI: true }}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onIdle={onIdle}
    >
      {cafes.map((cafe) => (
        <CafeMarker
          key={cafe.id}
          position={{ lat: cafe.lat, lng: cafe.lng }}
          cafeInfo={cafe}
          onMarkerClick={onMarkerClick}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
