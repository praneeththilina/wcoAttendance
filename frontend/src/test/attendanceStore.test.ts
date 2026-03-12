import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAttendanceStore } from '../stores/attendanceStore';

// Mock the attendanceService
vi.mock('../services/auth', () => ({
  attendanceService: {
    getTodayStatus: vi.fn(),
    checkIn: vi.fn(),
    checkOut: vi.fn(),
    changeLocation: vi.fn(),
  },
}));

describe('attendanceStore', () => {
  beforeEach(() => {
    useAttendanceStore.getState().clearQueue();
    vi.clearAllMocks();
  });

  it('should add items to the offline queue', () => {
    const store = useAttendanceStore.getState();
    store.addToQueue({
      type: 'check-in',
      data: { clientId: '123', location: { latitude: 0, longitude: 0 } },
    });

    expect(useAttendanceStore.getState().offlineQueue.length).toBe(1);
    expect(useAttendanceStore.getState().offlineQueue[0].type).toBe('check-in');
  });

  it('should remove items from the offline queue', () => {
    const store = useAttendanceStore.getState();
    store.addToQueue({
      type: 'check-in',
      data: { clientId: '123', location: { latitude: 0, longitude: 0 } },
    });

    const actionId = useAttendanceStore.getState().offlineQueue[0].id;
    store.removeFromQueue(actionId);

    expect(useAttendanceStore.getState().offlineQueue.length).toBe(0);
  });

  it('should set online status', () => {
    const store = useAttendanceStore.getState();
    store.setOnline(false);
    expect(useAttendanceStore.getState().isOnline).toBe(false);
    
    store.setOnline(true);
    expect(useAttendanceStore.getState().isOnline).toBe(true);
  });
});
