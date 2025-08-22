"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { Button } from "@/shared/ui/button";
import { Coffee, MapPin, Heart } from "lucide-react";
import type { CarouselApi } from "@/shared/ui/carousel";

const onboardingSlides = [
  {
    title: "Welcome to Cafe-it",
    subtitle: "",
    icon: Coffee,
    description: "You can check for available seats without having to go to the cafe.",
  },
  {
    title: "Find cafes easily on the map",
    subtitle: "",
    icon: MapPin,
    description:
      "You can easily find nearby cafes on the map and check detailed information.",
  },
  {
    title: "Favorites and Reviews",
    subtitle: "",
    icon: Heart,
    description:
      "Save your favorite cafes and leave reviews to share with other users.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);


  const handleStart = () => {
    router.push("/map");
  };

  const handleNext = () => {
    if (currentSlide === onboardingSlides.length - 1) {
      router.push("/map");
    } else {
      api?.scrollNext();
    }
  };

  const buttonText =
    currentSlide === onboardingSlides.length - 1 ? "Start" : "Next";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="flex justify-end p-6">
        <button
          onClick={handleStart}
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main content */}
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
                  {/* Icon */}
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-orange-400 rounded-3xl flex items-center justify-center shadow-lg">
                    <IconComponent className="w-12 h-12 text-white" />
                  </div>

                  {/* Text content */}
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

      {/* Bottom button */}
      <div className="p-6">
        <Button
          onClick={handleNext}
          className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
