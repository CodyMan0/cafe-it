"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingRedirector({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited && pathname !== "/onboarding") {
      sessionStorage.setItem("hasVisited", "true");
      router.replace("/onboarding");
    }
  }, [router, pathname]);

  return <>{children}</>;
}
