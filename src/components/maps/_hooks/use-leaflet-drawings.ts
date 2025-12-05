import { useCallback } from "react";

const STORAGE_KEY = "map-drawings";

export function useLeafletDrawings() {
  const saveToLocalStorage = useCallback(
    (geoJSON: GeoJSON.FeatureCollection) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(geoJSON));
        return true;
      } catch (error) {
        console.error("Failed to save drawings to localStorage:", error);
        return false;
      }
    },
    []
  );

  const loadFromLocalStorage =
    useCallback((): GeoJSON.FeatureCollection | null => {
      try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error("Failed to load drawings from localStorage:", error);
        return null;
      }
    }, []);

  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Failed to clear drawings from localStorage:", error);
      return false;
    }
  }, []);

  const hasStoredDrawings = useCallback((): boolean => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data !== null && data !== "null";
    } catch {
      return false;
    }
  }, []);

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    hasStoredDrawings,
  };
}
