"use client";

import { useState } from "react";
import { OverlayView } from "@react-google-maps/api";
import { CafeInfoSheet } from "./CafeInfoSheet";
import Image from "next/image";

interface CafeInfo {
  id: string;
  name: string;
  availableSeats: number;
  totalSeats: number;
  distance?: string;
}

interface CafeMarkerProps {
  position: { lat: number; lng: number };
  cafeInfo: CafeInfo;
}

const CafeMarker = ({ position, cafeInfo }: CafeMarkerProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleMarkerClick = () => {
    setIsSheetOpen(true);
  };

  const getPixelPositionOffset = (width: number, height: number) => ({
    x: -(width / 2),
    y: -height, // 아이콘의 하단 끝이 좌표에 맞도록 y 오프셋 조정
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
      <CafeInfoSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        cafeInfo={cafeInfo}
      />
    </>
  );
};

export default CafeMarker;
