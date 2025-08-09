import { CafeInfo, SeatAvailability } from "./types";

const BASE_URL =
  "http://ec2-52-78-140-238.ap-northeast-2.compute.amazonaws.com";

export async function extractCoordinatesFromUrl(
  url: string
): Promise<{ lat: number; lng: number }> {
  const response = await fetch(
    `${BASE_URL}/api/maps/extract?url=${encodeURIComponent(url)}`
  );
  const data = await response.json();
  if (data.type === "coordinates" && data.lat && data.lng) {
    return { lat: data.lat, lng: data.lng };
  }
  return { lat: 37.5665, lng: 126.978 };
}

export async function createCafe(payload: {
  name: string;
  lat: number;
  lng: number;
  totalSeats: number;
  url: string;
}): Promise<CafeInfo> {
  const response = await fetch(`${BASE_URL}/api/cafes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create cafe");
  return response.json();
}

export async function initSeatsAvailability(
  cafeId: string,
  availableSeats: number
): Promise<SeatAvailability> {
  const response = await fetch(
    `${BASE_URL}/api/cafes/${cafeId}/seats-availability`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalSeats: 2, availableSeats }),
    }
  );
  if (!response.ok) throw new Error("Failed to initialize seats");
  return response.json();
}

export async function getCafe(cafeId: string): Promise<CafeInfo> {
  const response = await fetch(`${BASE_URL}/api/cafes/${cafeId}`);
  if (!response.ok) throw new Error("Failed to fetch cafe info");
  return response.json();
}

export async function getSeatsAvailability(
  cafeId: string
): Promise<SeatAvailability> {
  const response = await fetch(
    `${BASE_URL}/api/cafes/${cafeId}/seats-availability`
  );
  if (!response.ok) throw new Error("Failed to fetch seat availability");
  return response.json();
}

export async function updateSeatsAvailability(
  cafeId: string,
  availableSeats: number
): Promise<SeatAvailability> {
  const response = await fetch(
    `${BASE_URL}/api/cafes/${cafeId}/seats-availability`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalSeats: 2, availableSeats }),
    }
  );
  if (!response.ok) throw new Error("Failed to update seat availability");
  return response.json();
}
