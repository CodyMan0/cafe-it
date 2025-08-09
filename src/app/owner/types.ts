export interface CafeInfo {
  id: string;
  name: string;
  lat: number;
  lng: number;
  totalSeats: number;
  url: string;
  availableSeats?: number;
}

export interface SeatAvailability {
  totalSeats: number;
  availableSeats: number;
  lastUpdated: string;
}
