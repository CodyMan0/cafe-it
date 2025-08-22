"use client";

import { useRouter } from "next/navigation";

import MobileBar from "@/features/ui/MobileBar";
import {
  ArrowRight,
  RefreshCw,
  Bell,
  Palette,
  Shield,
  HelpCircle,
  User2,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();

  const handleRevisitOnboarding = () => {
    sessionStorage.removeItem("hasVisited");
    router.push("/onboarding");
  };

  const handleGoToOwnerService = () => {
    router.push("/owner");
  };

  const settingsItems = [
    {
      icon: RefreshCw,
      title: "Revisit Onboarding",
      subtitle: "Check the service introduction again",
      onClick: handleRevisitOnboarding,
    },
    {
      icon: User2,
      title: "Go to Owner Service",
      subtitle: "Register as an owner and manage seat availability",
      onClick: handleGoToOwnerService,
    },
    {
      icon: Bell,
      title: "Notification Settings",
      subtitle: "Manage push notifications",
      onClick: () => {},
      disabled: true,
    },
    {
      icon: Palette,
      title: "Theme Settings",
      subtitle: "Choose between dark and light mode",
      onClick: () => {},
      disabled: true,
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      subtitle: "Information on collection and use of personal information",
      onClick: () => {},
      disabled: true,
    },
    {
      icon: HelpCircle,
      title: "Customer Service",
      subtitle: "Inquiries or bug reports",
      onClick: () => {},
      disabled: true,
    },
  ];

  return (
    <main className="relative flex flex-col h-screen pb-16 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Settings list */}
      <div className="flex-1 px-2 py-4 space-y-2">
        {settingsItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              onClick={item.onClick}
              disabled={item.disabled}
              className={`w-full bg-white rounded-2xl p-4 flex items-center justify-between transition-all duration-200 ${
                item.disabled
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-gray-50 active:bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.disabled ? "bg-gray-100" : "bg-primary-100/10"
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      item.disabled ? "text-gray-400" : "text-primary-100"
                    }`}
                  />
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    {item.disabled && (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-500 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-300" />
            </button>
          );
        })}
      </div>

      {/* App info */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">Cafe-it v0.0.1</p>
        </div>
      </div>

      <MobileBar />
    </main>
  );
}
