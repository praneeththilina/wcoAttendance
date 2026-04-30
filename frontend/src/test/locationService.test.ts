import { describe, it, expect } from 'vitest';
import { calculateDistance } from '../services/locationService';

describe('locationService', () => {
  describe('calculateDistance', () => {
    it('should return 0 for identical coordinates', () => {
      const distance = calculateDistance(40.7128, -74.0060, 40.7128, -74.0060);
      expect(distance).toBe(0);
    });

    it('should calculate the distance between New York and London correctly', () => {
      // Known distance is approximately 5570 km
      const distance = calculateDistance(40.7128, -74.0060, 51.5074, -0.1278);
      // Allow for some minor variance depending on Earth radius constants, should be around 5570222 meters
      expect(distance).toBeGreaterThan(5500000);
      expect(distance).toBeLessThan(5600000);
      expect(Math.round(distance)).toBe(5570222);
    });

    it('should calculate 1 degree of longitude at the equator correctly', () => {
      // 1 degree at the equator is roughly 111.32 km
      const distance = calculateDistance(0, 0, 0, 1);
      expect(Math.round(distance)).toBe(111195);
    });

    it('should be commutative (A to B equals B to A)', () => {
      const dist1 = calculateDistance(34.0522, -118.2437, -33.8688, 151.2093); // LA to Sydney
      const dist2 = calculateDistance(-33.8688, 151.2093, 34.0522, -118.2437); // Sydney to LA
      expect(dist1).toBe(dist2);
    });

    it('should calculate the distance for antipodal points correctly', () => {
      // 0,0 to 0,180 is halfway around the world
      const distance = calculateDistance(0, 0, 0, 180);
      // Half circumference is approx Math.PI * 6371000 = 20015086
      expect(Math.round(distance)).toBe(20015087);
    });
  });
});
