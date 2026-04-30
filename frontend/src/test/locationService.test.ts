import { describe, it, expect } from 'vitest';
import { parseStoredLocation, LocationData } from '../services/locationService';

describe('locationService', () => {
  describe('parseStoredLocation', () => {
    it('should correctly parse a valid location JSON string', () => {
      const validLocation: LocationData = {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 10,
        altitude: null,
        speed: null,
        timestamp: 1672531200000,
      };

      const jsonString = JSON.stringify(validLocation);
      const parsed = parseStoredLocation(jsonString);

      expect(parsed).toEqual(validLocation);
    });

    it('should return null for an invalid JSON string', () => {
      const invalidJsonString = '{ latitude: 40.7128, longitude: -74.0060 }'; // Missing quotes
      const parsed = parseStoredLocation(invalidJsonString);

      expect(parsed).toBeNull();
    });

    it('should return null for an empty string', () => {
      const parsed = parseStoredLocation('');
      expect(parsed).toBeNull();
    });

    it('should return null for malformed JSON structure', () => {
      const parsed = parseStoredLocation('{"latitude": 40.7128, "longitude": -74.0060'); // Missing closing brace
      expect(parsed).toBeNull();
    });

    it('should handle location string with missing optional fields', () => {
      const locationWithMissingOptionals = {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 10,
        timestamp: 1672531200000,
      };

      const jsonString = JSON.stringify(locationWithMissingOptionals);
      const parsed = parseStoredLocation(jsonString);

      expect(parsed).toEqual(locationWithMissingOptionals);
    });
  });
});
