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
      title: "온보딩 다시 보기",
      subtitle: "서비스 소개를 다시 확인해보세요",
      onClick: handleRevisitOnboarding,
    },
    {
      icon: User2,
      title: "점주 서비스로 이동하기",
      subtitle: "점주로 등록하고 자리 현황을 관리해보세요",
      onClick: handleGoToOwnerService,
    },
    {
      icon: Bell,
      title: "알림 설정",
      subtitle: "푸시 알림을 관리하세요",
      onClick: () => {},
      disabled: true,
    },
    {
      icon: Palette,
      title: "테마 설정",
      subtitle: "다크모드와 라이트모드를 선택하세요",
      onClick: () => {},
      disabled: true,
    },
    {
      icon: Shield,
      title: "개인정보 처리방침",
      subtitle: "개인정보 수집 및 이용에 대한 안내",
      onClick: () => {},
      disabled: true,
    },
    {
      icon: HelpCircle,
      title: "고객센터",
      subtitle: "문의사항이나 버그 신고",
      onClick: () => {},
      disabled: true,
    },
  ];

  return (
    <main className="relative flex flex-col h-screen pb-16 bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">설정</h1>
      </div>

      {/* 설정 목록 */}
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
                        준비중
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

      {/* 앱 정보 */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-500">카페잇 v0.0.1</p>
        </div>
      </div>

      <MobileBar />
    </main>
  );
}
