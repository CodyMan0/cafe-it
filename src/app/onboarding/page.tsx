"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { Button } from "@/shared/ui/button";
import { Coffee, MapPin, Heart } from "lucide-react";
import type { CarouselApi } from "@/shared/ui/carousel";

const onboardingSlides = [
  {
    title: "카페잇에 오신 것을 환영합니다",
    subtitle: "",
    icon: Coffee,
    description: "직접 카페를 가지 않아도 자리를 확인할 수 있어요.",
  },
  {
    title: "지도로 쉽게 찾기",
    subtitle: "",
    icon: MapPin,
    description:
      "지도를 통해 주변 카페를 쉽게 찾고, 상세한 정보를 확인할 수 있습니다.",
  },
  {
    title: "즐겨찾기와 리뷰",
    subtitle: "",
    icon: Heart,
    description:
      "좋아하는 카페를 저장하고, 방문 후기를 남겨 다른 사용자들과 공유해보세요.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi | null>(null);

  const handleStart = () => {
    router.push("/map");
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="flex justify-end p-6">
        <button
          onClick={handleStart}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          건너뛰기
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <Carousel
          className="w-full"
          setApi={setApi}
          opts={{
            loop: false,
            skipSnaps: false,
          }}
        >
          <CarouselContent>
            {onboardingSlides.map((slide, index) => {
              const IconComponent = slide.icon;
              return (
                <CarouselItem
                  key={index}
                  className="flex flex-col items-center justify-center text-center space-y-8"
                >
                  {/* 아이콘 */}
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-orange-400 rounded-3xl flex items-center justify-center shadow-lg">
                    <IconComponent className="w-12 h-12 text-white" />
                  </div>

                  {/* 텍스트 콘텐츠 */}
                  <div className="space-y-4 max-w-sm">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg font-medium text-primary-100">
                      {slide.subtitle}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {slide.description}
                    </p>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      {/* 하단 버튼 */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
