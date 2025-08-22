import { CafeResponse } from "@/app/apis/map/useGetCafesQuery";

const FAVORITES_KEY = "cafe-it-favorites";

export const getFavorites = (): CafeResponse[] => {
  if (typeof window === "undefined") {
    return [];
  }
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const addFavorite = (cafe: CafeResponse) => {
  const favorites = getFavorites();
  if (!favorites.find((fav) => fav.id === cafe.id)) {
    const newFavorites = [...favorites, cafe];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }
};

export const removeFavorite = (cafeId: string) => {
  const favorites = getFavorites();
  const newFavorites = favorites.filter((fav) => fav.id !== cafeId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
};

export const isFavorite = (cafeId: string): boolean => {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.id === cafeId);
};
