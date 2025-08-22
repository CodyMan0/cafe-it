export function formatRelativeTime(
  isoString: string,
  currentTime: Date
): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "No date information";

    const diffInMs = currentTime.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "No date information";
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
  if (availableSeats === 0) return "No seats";
  if (availableSeats === 1) return "Seats available";
  return "Plenty of seats";
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
