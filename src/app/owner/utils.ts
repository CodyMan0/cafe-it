export function formatRelativeTime(
  isoString: string,
  currentTime: Date
): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "날짜 정보 없음";

    const diffInMs = currentTime.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "방금 전";
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  } catch {
    return "날짜 정보 없음";
  }
}

export function seatCountToStatus(
  availableSeats: number
): "red" | "yellow" | "green" {
  if (availableSeats === 0) return "red";
  if (availableSeats === 1) return "yellow";
  return "green";
}

export function seatStatusText(availableSeats: number): string {
  if (availableSeats === 0) return "자리 없음";
  if (availableSeats === 1) return "자리 있음";
  return "자리 많음";
}

export function seatStatusColor(availableSeats: number): string {
  if (availableSeats === 0) return "bg-red-500 text-white";
  if (availableSeats === 1) return "bg-yellow-500 text-white";
  return "bg-green-500 text-white";
}

// Display cafeId as truncated with ... when it exceeds a max length
export function displayCafeId(id: string, maxLength = 14): string {
  if (!id) return "";
  if (id.length <= maxLength) return id;
  const reservedForDots = 3;
  const visible = maxLength - reservedForDots;
  const startLen = Math.ceil(visible / 2);
  const endLen = Math.floor(visible / 2);
  return `${id.slice(0, startLen)}...${id.slice(-endLen)}`;
}
