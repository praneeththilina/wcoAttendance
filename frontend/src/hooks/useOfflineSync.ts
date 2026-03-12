import { useEffect } from 'react';
import { useAttendanceStore } from '@/stores/attendanceStore';

export function useOfflineSync() {
  const { setOnline, syncQueue } = useAttendanceStore();

  useEffect(() => {
    const handleOnline = () => {
      console.log('App is online');
      setOnline(true);
      syncQueue();
    };

    const handleOffline = () => {
      console.log('App is offline');
      setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline, syncQueue]);
}
