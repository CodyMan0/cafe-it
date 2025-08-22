"use client";

import { Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export default function MobileBar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      id: "map",
      label: "Map",
      path: "/map",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
        </svg>
      ),
    },

    {
      id: "setting",
      label: "Settings",
      path: "/settings",
      icon: <Settings className="w-6 h-6" />,
      activeIcon: <Settings className="w-6 h-6" />,
    },
  ];

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.path)}
              className={`flex flex-col items-center justify-center w-full py-2 px-1 rounded-lg transition-colors ${
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="mb-1">
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
