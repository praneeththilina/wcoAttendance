import { useState, useCallback } from 'react';
import {
  getCurrentLocation,
  validateLocation,
  type LocationData,
  type LocationValidationResult,
  type ClientLocation,
} from '@/services/locationService';

interface UseLocationValidationReturn {
  location: LocationData | null;
  validation: LocationValidationResult | null;
  isLoading: boolean;
  error: string | null;
  fetchAndValidate: (clientLocation?: ClientLocation) => Promise<LocationValidationResult | null>;
  reset: () => void;
}

export function useLocationValidation(): UseLocationValidationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [validation, setValidation] = useState<LocationValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndValidate = useCallback(async (clientLocation?: ClientLocation) => {
    setIsLoading(true);
    setError(null);

    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);

      const validationResult = validateLocation(locationData, clientLocation);
      setValidation(validationResult);

      return validationResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLocation(null);
    setValidation(null);
    setError(null);
  }, []);

  return {
    location,
    validation,
    isLoading,
    error,
    fetchAndValidate,
    reset,
  };
}
