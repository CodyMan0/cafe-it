import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function convertRecordValueString(
  target: Record<string | number, any> | undefined
) {
  if (target === undefined || target === null) return {};
  const result = {} as Record<string, string>;
  Object.keys(target).forEach((key) => {
    if (target[key] === undefined || target[key] === null) return;
    if (typeof target[key] === "object") {
      result[key.toString()] = JSON.stringify(target[key]);
      return;
    }
    result[key.toString()] = `${target[key]}`;
  });
  return result;
}
