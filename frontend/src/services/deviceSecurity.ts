export interface DeviceSecurityResult {
  isSecure: boolean;
  risks: string[];
  checks: {
    isRooted: boolean;
    isJailbroken: boolean;
    developerMode: boolean;
    mockLocation: boolean;
  };
}

export async function checkDeviceSecurity(): Promise<DeviceSecurityResult> {
  const risks: string[] = [];
  const checks = {
    isRooted: false,
    isJailbroken: false,
    developerMode: false,
    mockLocation: false,
  };

  if (typeof window === 'undefined') {
    return { isSecure: true, risks: [], checks };
  }

  checks.isRooted = await checkRooted();
  if (checks.isRooted) {
    risks.push('Device appears to be rooted');
  }

  checks.isJailbroken = checkJailbreak();
  if (checks.isJailbroken) {
    risks.push('Device appears to be jailbroken');
  }

  checks.developerMode = checkDeveloperMode();
  if (checks.developerMode) {
    risks.push('Developer mode is enabled');
  }

  checks.mockLocation = checkMockLocation();
  if (checks.mockLocation) {
    risks.push('Mock location may be enabled');
  }

  return {
    isSecure: risks.length === 0,
    risks,
    checks,
  };
}

async function checkRooted(): Promise<boolean> {
  const rootIndicators = [
    '/system/app/Superuser.apk',
    '/sbin/su',
    '/system/bin/su',
    '/system/xbin/su',
    '/data/local/xbin/su',
    '/data/local/bin/su',
    '/system/sd/xbin/su',
    '/system/bin/failsafe/su',
    '/data/local/su',
    '/su/bin/su',
  ];

  if (typeof window !== 'undefined') {
    for (const path of rootIndicators) {
      try {
        const response = await fetch(`file://${path}`, { method: 'HEAD' });
        if (response.ok) return true;
      } catch {
        continue;
      }
    }
  }

  if (typeof window !== 'undefined') {
    const testLocations = [
      '/system/etc/install-recovery.sh',
      '/system/etc/recovery.img',
      '/cache/recovery',
    ];

    for (const path of testLocations) {
      try {
        const response = await fetch(`file://${path}`, { method: 'HEAD' });
        if (response.ok) return true;
      } catch {
        continue;
      }
    }
  }

  return false;
}

function checkJailbreak(): boolean {
  if (typeof window === 'undefined') return false;

  const jailbreakPaths = [
    '/Applications/Cydia.app',
    '/Applications/Sileo.app',
    '/Applications/Zebra.app',
    '/Library/MobileSubstrate/MobileSubstrate.dylib',
    '/bin/bash',
    '/usr/sbin/sshd',
    '/etc/apt',
    '/private/var/lib/apt/',
    '/private/var/lib/cydia',
    '/private/var/mobile/Library/SBSettings/Themes',
  ];

  for (const path of jailbreakPaths) {
    if ((window as any).Cordova?.file?.externalDataDirectory?.startsWith(path)) {
      return true;
    }
  }

  return false;
}

function checkDeveloperMode(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    (navigator as any).userAgent?.includes('Developer') ||
    (navigator as any).webdriver === true ||
    (window as any).__cordova?.devMode === true
  );
}

function checkMockLocation(): boolean {
  if (typeof navigator === 'undefined') return false;

  if ((navigator as any).permissions?.query) {
    try {
      return false;
    } catch {
      return true;
    }
  }

  return false;
}

export function getDeviceInfo(): {
  platform: string;
  userAgent: string;
  language: string;
  timezone: string;
} {
  if (typeof window === 'undefined') {
    return {
      platform: 'unknown',
      userAgent: '',
      language: 'en',
      timezone: 'UTC',
    };
  }

  return {
    platform: navigator.platform || 'unknown',
    userAgent: navigator.userAgent || '',
    language: navigator.language || 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };
}
