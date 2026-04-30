import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { getDeviceInfo } from './deviceSecurity';

describe('getDeviceInfo', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('should return fallback values if window is undefined', () => {
    vi.stubGlobal('window', undefined);

    const result = getDeviceInfo();
    expect(result).toEqual({
      platform: 'unknown',
      userAgent: '',
      language: 'en',
      timezone: 'UTC',
      screenResolution: 'unknown'
    });
  });

  it('should return device info from navigator and Intl if window is defined', () => {
    vi.stubGlobal('window', {
      screen: {
        width: 1920,
        height: 1080
      }
    });
    vi.stubGlobal('navigator', {
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Test)',
      language: 'en-GB',
    });

    const mockResolvedOptions = vi.fn().mockReturnValue({ timeZone: 'America/New_York' });
    const mockDateTimeFormat = vi.fn().mockReturnValue({ resolvedOptions: mockResolvedOptions });
    vi.stubGlobal('Intl', {
      DateTimeFormat: mockDateTimeFormat,
    });

    const result = getDeviceInfo();
    expect(result).toEqual({
      platform: 'Win32',
      userAgent: 'Mozilla/5.0 (Test)',
      language: 'en-GB',
      timezone: 'America/New_York',
      screenResolution: '1920x1080'
    });
  });

  it('should return default fallback values if navigator properties and Intl timezone are missing', () => {
    vi.stubGlobal('window', {
      screen: {
        width: 1024,
        height: 768
      }
    });
    vi.stubGlobal('navigator', {});

    const mockResolvedOptions = vi.fn().mockReturnValue({ timeZone: undefined });
    const mockDateTimeFormat = vi.fn().mockReturnValue({ resolvedOptions: mockResolvedOptions });
    vi.stubGlobal('Intl', {
      DateTimeFormat: mockDateTimeFormat,
    });

    const result = getDeviceInfo();
    expect(result).toEqual({
      platform: 'unknown',
      userAgent: '',
      language: 'en',
      timezone: 'UTC',
      screenResolution: '1024x768'
    });
  });
});
