export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  speed?: number | null;
  timestamp: number;
}

export interface LocationValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  location?: LocationData | null;
  metadata?: {
    isMockLocation: boolean;
    isRooted: boolean;
    lowAccuracy: boolean;
    gpsProvider: boolean;
  };
}

export interface ClientLocation {
  latitude: number;
  longitude: number;
  radius: number;
}

const MIN_ACCURACY_METERS = 100;
const MAX_MOCK_ACCURACY = 10;
const IMPOSSIBLE_SPEED_KMH = 500;

export async function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  });
}

export function validateLocation(
  location: LocationData,
  clientLocation?: ClientLocation
): LocationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const metadata = {
    isMockLocation: false,
    isRooted: false,
    lowAccuracy: false,
    gpsProvider: true,
  };

  if (location.accuracy > MIN_ACCURACY_METERS) {
    warnings.push(
      `Low accuracy: ${location.accuracy.toFixed(0)}m (recommended: <${MIN_ACCURACY_METERS}m)`
    );
    metadata.lowAccuracy = true;
  }

  if (location.accuracy < MAX_MOCK_ACCURACY && location.accuracy !== 0) {
    metadata.isMockLocation = true;
    warnings.push('Suspiciously high accuracy - possible mock location');
  }

  if (
    location.speed !== null &&
    location.speed !== undefined &&
    location.speed > IMPOSSIBLE_SPEED_KMH / 3.6
  ) {
    errors.push('Impossible travel speed detected');
  }

  if (clientLocation) {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      clientLocation.latitude,
      clientLocation.longitude
    );

    if (distance > clientLocation.radius) {
      errors.push(
        `You are ${Math.round(distance)}m away from the allowed location (${clientLocation.radius}m radius)`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    location,
    metadata,
  };
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function isWithinWorkingHours(deadline: string = '08:30'): boolean {
  const now = new Date();
  const [hours, minutes] = deadline.split(':').map(Number);
  const deadlineTime = new Date(now);
  deadlineTime.setHours(hours, minutes, 0, 0);

  return now.getTime() <= deadlineTime.getTime();
}

export function formatLocationForStorage(location: LocationData): string {
  return JSON.stringify({
    latitude: location.latitude,
    longitude: location.longitude,
    accuracy: location.accuracy,
    altitude: location.altitude,
    timestamp: location.timestamp,
  });
}

export function parseStoredLocation(locationStr: string): LocationData | null {
  try {
    return JSON.parse(locationStr);
  } catch {
    return null;
  }
}
