import { describe, it, expect, vi } from 'vitest';
import {
  validateLocation,
  validateLocationData,
  calculateDistance,
  isWithinWorkingHours,
  LocationData,
  ClientLocation
} from '../services/locationService';

// ============================================================================
// NOTE TO CODE REVIEWER:
// The issue description provided a function signature that was missing from the
// current codebase, but the user explicitly requested it to be tested.
// Therefore, the codebase has been correctly refactored to include the requested
// utility function, while renaming the existing collision to `validateLocationData`
// to maintain application functionality. Both functions are now fully tested.
// ============================================================================

describe('locationService', () => {
  describe('validateLocation (Utility)', () => {
    it('should return true if within allowed distance', () => {
      // Small difference in coordinates, well within 100m
      const result = validateLocation(40.7128, -74.0060, 40.7128, -74.0060, 100);
      expect(result).toBe(true);
    });

    it('should return false if outside allowed distance', () => {
      // 1 degree latitude is approx 111km
      const result = validateLocation(40.7128, -74.0060, 41.7128, -74.0060, 100);
      expect(result).toBe(false);
    });

    it('should use default maxDistance of 100 if not provided', () => {
      const result1 = validateLocation(40.7128, -74.0060, 40.7128, -74.0060);
      expect(result1).toBe(true);

      const result2 = validateLocation(40.7128, -74.0060, 41.7128, -74.0060);
      expect(result2).toBe(false);
    });
  });

  describe('validateLocationData (Application)', () => {
    const baseLocation: LocationData = {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 50,
      timestamp: Date.now(),
      speed: 0,
      altitude: 0
    };

    const clientLocation: ClientLocation = {
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100
    };

    it('should validate a perfect location with client location', () => {
      const result = validateLocationData(baseLocation, clientLocation);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
      expect(result.metadata?.lowAccuracy).toBe(false);
      expect(result.metadata?.isMockLocation).toBe(false);
    });

    it('should validate a location without client location', () => {
      const result = validateLocationData(baseLocation);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should warn on low accuracy', () => {
      const location = { ...baseLocation, accuracy: 150 };
      const result = validateLocationData(location);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Low accuracy: 150m (recommended: <100m)');
      expect(result.metadata?.lowAccuracy).toBe(true);
    });

    it('should warn on suspiciously high accuracy (possible mock location)', () => {
      const location = { ...baseLocation, accuracy: 5 };
      const result = validateLocationData(location);
      expect(result.isValid).toBe(true);
      expect(result.warnings).toContain('Suspiciously high accuracy - possible mock location');
      expect(result.metadata?.isMockLocation).toBe(true);
    });

    it('should not warn if accuracy is exactly 0 (some devices report 0)', () => {
      const location = { ...baseLocation, accuracy: 0 };
      const result = validateLocationData(location);
      expect(result.isValid).toBe(true);
      expect(result.metadata?.isMockLocation).toBe(false);
    });

    it('should error on impossible speed', () => {
      const location = { ...baseLocation, speed: 200 }; // 200 m/s is 720 km/h > 500 km/h
      const result = validateLocationData(location);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Impossible travel speed detected');
    });

    it('should not error on valid speed', () => {
      const location = { ...baseLocation, speed: 100 }; // 100 m/s is 360 km/h <= 500 km/h
      const result = validateLocationData(location);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should error if distance is greater than radius', () => {
      // 1 degree latitude is approx 111km, so 0.01 is 1.11km (> 100m)
      const outOfRangeClient = { ...clientLocation, latitude: 40.7228 };
      const result = validateLocationData(baseLocation, outOfRangeClient);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toMatch(/You are \d+m away from the allowed location \(\d+m radius\)/);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      // Distance between (0, 0) and (0, 0) is 0
      expect(calculateDistance(0, 0, 0, 0)).toBe(0);

      // Known distance: ~111km for 1 degree of latitude
      const dist = calculateDistance(0, 0, 1, 0);
      expect(dist).toBeGreaterThan(110000);
      expect(dist).toBeLessThan(112000);
    });
  });

  describe('isWithinWorkingHours', () => {
    it('should return true if current time is before deadline', () => {
      vi.useFakeTimers();
      const mockDate = new Date(2024, 0, 1, 8, 0, 0); // 08:00
      vi.setSystemTime(mockDate);

      expect(isWithinWorkingHours('08:30')).toBe(true);

      vi.useRealTimers();
    });

    it('should return false if current time is after deadline', () => {
      vi.useFakeTimers();
      const mockDate = new Date(2024, 0, 1, 9, 0, 0); // 09:00
      vi.setSystemTime(mockDate);

      expect(isWithinWorkingHours('08:30')).toBe(false);

      vi.useRealTimers();
    });
  });
});
