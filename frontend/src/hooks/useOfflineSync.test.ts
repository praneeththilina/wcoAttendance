import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useOfflineSync } from './useOfflineSync';
import { useAttendanceStore } from '@/stores/attendanceStore';

// Mock the store
vi.mock('@/stores/attendanceStore', () => ({
  useAttendanceStore: vi.fn(),
}));

describe('useOfflineSync', () => {
  let setOnlineMock: any;
  let syncQueueMock: any;

  beforeEach(() => {
    setOnlineMock = vi.fn();
    syncQueueMock = vi.fn();

    (useAttendanceStore as any).mockReturnValue({
      setOnline: setOnlineMock,
      syncQueue: syncQueueMock,
    });

    // Mock navigator.onLine
    vi.stubGlobal('navigator', { onLine: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with current navigator.onLine status', () => {
    renderHook(() => useOfflineSync());
    expect(setOnlineMock).toHaveBeenCalledWith(true);
  });

  it('should add event listeners on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    renderHook(() => useOfflineSync());

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });

  it('should set online and sync queue when going online', () => {
    renderHook(() => useOfflineSync());

    // clear initial mock call
    setOnlineMock.mockClear();

    // simulate online event
    window.dispatchEvent(new Event('online'));

    expect(setOnlineMock).toHaveBeenCalledWith(true);
    expect(syncQueueMock).toHaveBeenCalled();
  });

  it('should set offline when going offline', () => {
    renderHook(() => useOfflineSync());

    // clear initial mock call
    setOnlineMock.mockClear();

    // simulate offline event
    window.dispatchEvent(new Event('offline'));

    expect(setOnlineMock).toHaveBeenCalledWith(false);
    expect(syncQueueMock).not.toHaveBeenCalled();
  });

  it('should remove event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useOfflineSync());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });
});
