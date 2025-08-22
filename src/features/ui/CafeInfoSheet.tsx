"use client";

import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { MapPin, Users, Clock, Heart } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { addFavorite, removeFavorite, isFavorite } from "@/lib/favorites";
import { CafeResponse } from "@/app/apis/map/useGetCafesQuery";

interface CafeInfo {
  id: string;
  name: string;
  availableSeats: number;
  totalSeats: number;
  distance?: string;
}

interface CafeInfoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cafeInfo: CafeInfo;
}

export function CafeInfoSheet({
  open,
  onOpenChange,
  cafeInfo,
}: CafeInfoSheetProps) {
  const isAvailable = cafeInfo.availableSeats > 0;
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(cafeInfo.id));
  }, [cafeInfo]);

  const handleFavoriteClick = () => {
    if (isFav) {
      removeFavorite(cafeInfo.id);
      setIsFav(false);
    } else {
      addFavorite(cafeInfo as CafeResponse);
      setIsFav(true);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <motion.div
        className="p-6 space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Cafe name */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {cafeInfo.name}
          </h2>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
          </div>
          {cafeInfo.distance && (
            <div className="flex items-center text-gray-500 mt-1">
              <span className="text-sm">{cafeInfo.distance}</span>
            </div>
          )}
        </motion.div>

        {/* Seat availability */}
        <motion.div
          className="bg-gray-50 rounded-xl p-4"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-600" />
              <span className="font-semibold text-gray-900">Seat availability</span>
            </div>
            <motion.div
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                isAvailable
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              {isAvailable ? "Seats available" : "No seats"}
            </motion.div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total seats</span>
              <span className="font-semibold">{cafeInfo.totalSeats} seats</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Available</span>
              <span
                className={cn(
                  "font-semibold",
                  isAvailable ? "text-green-600" : "text-red-600"
                )}
              >
                {cafeInfo.availableSeats} seats
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">In use</span>
              <span className="font-semibold text-gray-900">
                {cafeInfo.totalSeats - cafeInfo.availableSeats} seats
              </span>
            </div>
          </div>
        </motion.div>

        {/* Additional information */}
        <motion.div
          className="bg-blue-50 rounded-xl p-4"
          variants={itemVariants}
        >
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            <span className="font-semibold text-gray-900">Operating information</span>
          </div>
          <p className="text-sm text-gray-600">
            Check the real-time seat availability.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div className="space-y-3" variants={itemVariants}>
          <motion.button
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get directions
          </motion.button>
          <motion.button
            onClick={handleFavoriteClick}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart
              className={cn("w-5 h-5 mr-2", isFav && "fill-red-500 text-red-500")}
            />
            {isFav ? "Remove from favorites" : "Add to favorites"}
          </motion.button>
        </motion.div>
      </motion.div>
    </BottomSheet>
  );
}
