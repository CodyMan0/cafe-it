"use client";

import { CafeResponse } from "@/app/apis/map/useGetCafesQuery";
import { OverlayView } from "@react-google-maps/api";
import Image from "next/image";

interface CafeMarkerProps {
  position: { lat: number; lng: number };
  cafeInfo: CafeResponse;
  onMarkerClick: (cafeInfo: CafeResponse) => void;
}

const CafeMarker = ({ position, cafeInfo, onMarkerClick }: CafeMarkerProps) => {
  const handleMarkerClick = () => {
    onMarkerClick(cafeInfo);
  };

  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -height, // Adjust y-offset so that the bottom end of the icon matches the coordinates
  });

  return (
    <>
      <OverlayView
        position={position}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={getPixelPositionOffset}
      >
        <div className="cafe-marker cursor-pointer" onClick={handleMarkerClick}>
          <Image
            src="/icon/pin.svg"
            alt="Cafe Marker"
            className="w-8 h-8"
            width={40}
            height={40}
          />
        </div>
      </OverlayView>
    </>
  );
};

export default CafeMarker;
