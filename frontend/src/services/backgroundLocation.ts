import { getCurrentLocation, type LocationData } from './locationService';

const SCHEDULED_HOUR = 9;
const SCHEDULED_MINUTE = 30;
const CHECK_IN_DEADLINE_HOUR = 8;
const CHECK_IN_DEADLINE_MINUTE = 30;

export interface ScheduledLocationCheck {
  id: string;
  scheduledTime: Date;
  location: LocationData | null;
  captured: boolean;
  status: 'pending' | 'captured' | 'failed';
}

class BackgroundLocationService {
  private checkInterval: NodeJS.Timeout | null = null;
  private scheduledCheck: ScheduledLocationCheck | null = null;
  private onLocationCapture?: (location: LocationData, isLate: boolean) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadScheduledCheck();
    }
  }

  setOnLocationCapture(callback: (location: LocationData, isLate: boolean) => void) {
    this.onLocationCapture = callback;
  }

  async scheduleLocationCheck(): Promise<void> {
    const now = new Date();
    const todayDeadline = new Date(now);
    todayDeadline.setHours(CHECK_IN_DEADLINE_HOUR, CHECK_IN_DEADLINE_MINUTE, 0, 0);

    const isBeforeDeadline = now.getTime() < todayDeadline.getTime();

    const scheduledTime = new Date(now);
    if (isBeforeDeadline) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    scheduledTime.setHours(SCHEDULED_HOUR, SCHEDULED_MINUTE, 0, 0);

    this.scheduledCheck = {
      id: `check_${Date.now()}`,
      scheduledTime,
      location: null,
      captured: false,
      status: 'pending',
    };

    this.saveScheduledCheck();
    this.startMonitoring();
  }

  private startMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(() => {
      this.checkAndCaptureLocation();
    }, 60000);

    this.checkAndCaptureLocation();
  }

  private async checkAndCaptureLocation(): Promise<void> {
    if (!this.scheduledCheck || this.scheduledCheck.captured) {
      return;
    }

    const now = new Date();
    const scheduledTime = new Date(this.scheduledCheck.scheduledTime);

    if (now.getTime() >= scheduledTime.getTime()) {
      await this.captureLocation();
    }
  }

  private async captureLocation(): Promise<void> {
    if (!this.scheduledCheck || this.scheduledCheck.captured) {
      return;
    }

    try {
      const location = await getCurrentLocation();
      const todayDeadline = new Date();
      todayDeadline.setHours(CHECK_IN_DEADLINE_HOUR, CHECK_IN_DEADLINE_MINUTE, 0, 0);
      const isLate = new Date().getTime() > todayDeadline.getTime();

      this.scheduledCheck.location = location;
      this.scheduledCheck.captured = true;
      this.scheduledCheck.status = 'captured';

      this.saveScheduledCheck();

      if (this.onLocationCapture) {
        this.onLocationCapture(location, isLate);
      }

      this.scheduleNextCheck();
    } catch (error) {
      this.scheduledCheck.status = 'failed';
      this.saveScheduledCheck();
      console.error('Failed to capture background location:', error);
    }
  }

  private scheduleNextCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    if (this.scheduledCheck) {
      const nextScheduled = new Date(this.scheduledCheck.scheduledTime);
      nextScheduled.setDate(nextScheduled.getDate() + 1);

      this.scheduledCheck = {
        ...this.scheduledCheck,
        scheduledTime: nextScheduled,
        captured: false,
        status: 'pending',
      };

      this.saveScheduledCheck();
      this.startMonitoring();
    }
  }

  cancelScheduledCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.scheduledCheck = null;
    localStorage.removeItem('scheduled_location_check');
  }

  getScheduledCheck(): ScheduledLocationCheck | null {
    return this.scheduledCheck;
  }

  private saveScheduledCheck(): void {
    if (this.scheduledCheck && typeof localStorage !== 'undefined') {
      localStorage.setItem('scheduled_location_check', JSON.stringify(this.scheduledCheck));
    }
  }

  private loadScheduledCheck(): void {
    if (typeof localStorage === 'undefined') return;

    const saved = localStorage.getItem('scheduled_location_check');
    if (saved) {
      try {
        this.scheduledCheck = JSON.parse(saved);
        if (this.scheduledCheck && !this.scheduledCheck.captured) {
          this.startMonitoring();
        }
      } catch {
        this.scheduledCheck = null;
      }
    }
  }

  isWithinCheckInTime(): boolean {
    const now = new Date();
    const deadline = new Date(now);
    deadline.setHours(CHECK_IN_DEADLINE_HOUR, CHECK_IN_DEADLINE_MINUTE, 0, 0);

    return now.getTime() <= deadline.getTime();
  }

  getTimeUntilDeadline(): number {
    const now = new Date();
    const deadline = new Date(now);
    deadline.setHours(CHECK_IN_DEADLINE_HOUR, CHECK_IN_DEADLINE_MINUTE, 0, 0);

    if (now.getTime() > deadline.getTime()) {
      const tomorrow = new Date(deadline);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.getTime() - now.getTime();
    }

    return deadline.getTime() - now.getTime();
  }
}

export const backgroundLocationService = new BackgroundLocationService();
