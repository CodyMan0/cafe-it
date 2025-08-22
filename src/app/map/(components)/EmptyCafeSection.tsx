import { Button } from "@/shared/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import React from "react";

const EmptyCafeSection = () => {
  return (
    <div className="flex flex-col items-center justify-center max-h-[30vh] space-y-4 p-8">
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
  );
};

export default EmptyCafeSection;
