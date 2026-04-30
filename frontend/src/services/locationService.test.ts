import { describe, it, expect } from 'vitest';
import {
  validateLocation,
  calculateDistance,
  LocationData,
  ClientLocation
} from './locationService';

describe('locationService', () => {
  describe('calculateDistance', () => {
    it('calculates distance correctly between two points', () => {
      // New York to London
      const lat1 = 40.7128;
      const lon1 = -74.0060;
      const lat2 = 51.5074;
      const lon2 = -0.1278;

      const distance = calculateDistance(lat1, lon1, lat2, lon2);
      // Rough distance is about 5570km
      expect(distance).toBeGreaterThan(5500000);
      expect(distance).toBeLessThan(5600000);
    });

    it('returns 0 for the same point', () => {
      const lat = 40.7128;
      const lon = -74.0060;
      const distance = calculateDistance(lat, lon, lat, lon);
      expect(distance).toBe(0);
    });
  });

  describe('validateLocation', () => {
    const validLocation: LocationData = {
      latitude: 40.7128,
      longitude: -74.0060,
      accuracy: 50,
      speed: 0,
      timestamp: Date.now()
    };

    const clientLocation: ClientLocation = {
      latitude: 40.7128,
      longitude: -74.0060,
      radius: 100
    };

    it('validates a correct location', () => {
      const result = validateLocation(validLocation);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
      expect(result.warnings.length).toBe(0);
      expect(result.metadata?.lowAccuracy).toBe(false);
      expect(result.metadata?.isMockLocation).toBe(false);
    });

    it('generates a warning for low accuracy', () => {
      const lowAccuracyLoc = { ...validLocation, accuracy: 150 };
      const result = validateLocation(lowAccuracyLoc);
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0]).toContain('Low accuracy');
      expect(result.metadata?.lowAccuracy).toBe(true);
    });

    it('detects possible mock locations with suspicious accuracy', () => {
      const mockLoc = { ...validLocation, accuracy: 5 }; // less than MAX_MOCK_ACCURACY (10)
      const result = validateLocation(mockLoc);
      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBe(1);
      expect(result.warnings[0]).toContain('possible mock location');
      expect(result.metadata?.isMockLocation).toBe(true);
    });

    it('does not flag perfect 0 accuracy as mock location (some devices report 0 for no fix)', () => {
        const zeroAccuracyLoc = { ...validLocation, accuracy: 0 };
        const result = validateLocation(zeroAccuracyLoc);
        // It should still be low accuracy warning because it's not useful, wait let's check code
        // Code says: if (location.accuracy < MAX_MOCK_ACCURACY && location.accuracy !== 0)
        expect(result.metadata?.isMockLocation).toBe(false);
    });

    it('generates an error for impossible travel speeds', () => {
      // 500 km/h in m/s is ~138.89 m/s
      const fastLoc = { ...validLocation, speed: 150 };
      const result = validateLocation(fastLoc);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('Impossible travel speed');
    });

    it('validates location successfully when within client radius', () => {
      // Slightly different location but within 100m
      const nearLoc = { ...validLocation, latitude: 40.71285, longitude: -74.00605 };
      const result = validateLocation(nearLoc, clientLocation);
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('generates an error when outside client radius', () => {
      // Much different location (e.g., Boston)
      const farLoc = { ...validLocation, latitude: 42.3601, longitude: -71.0589 };
      const result = validateLocation(farLoc, clientLocation);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain('away from the allowed location');
    });
  });
});
