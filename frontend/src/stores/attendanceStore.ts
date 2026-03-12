import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AttendanceStatus } from '@/types';
import { attendanceService } from '@/services/auth';

export interface OfflineAction {
  id: string;
  type: 'check-in' | 'check-out' | 'change-location';
  data: any;
  timestamp: string;
}

interface AttendanceState {
  todayStatus: AttendanceStatus | null;
  offlineQueue: OfflineAction[];
  isOnline: boolean;
  isSyncing: boolean;
  
  // Actions
  setTodayStatus: (status: AttendanceStatus | null) => void;
  addToQueue: (action: Omit<OfflineAction, 'id' | 'timestamp'>) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  setOnline: (online: boolean) => void;
  syncQueue: () => Promise<void>;
  fetchTodayStatus: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      todayStatus: null,
      offlineQueue: [],
      isOnline: navigator.onLine,
      isSyncing: false,

      setTodayStatus: (status) => set({ todayStatus: status }),

      addToQueue: (action) => {
        const newAction: OfflineAction = {
          ...action,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          offlineQueue: [...state.offlineQueue, newAction],
        }));
      },

      removeFromQueue: (id) => {
        set((state) => ({
          offlineQueue: state.offlineQueue.filter((a) => a.id !== id),
        }));
      },

      clearQueue: () => set({ offlineQueue: [] }),

      setOnline: (online) => {
        set({ isOnline: online });
        if (online && get().offlineQueue.length > 0) {
          get().syncQueue();
        }
      },

      syncQueue: async () => {
        const { offlineQueue, isSyncing, isOnline } = get();
        if (isSyncing || !isOnline || offlineQueue.length === 0) return;

        set({ isSyncing: true });
        
        const queue = [...offlineQueue];
        for (const action of queue) {
          try {
            if (action.type === 'check-in') {
              await attendanceService.checkIn(action.data.clientId, action.data.location);
            } else if (action.type === 'check-out') {
              await attendanceService.checkOut(action.data.location);
            } else if (action.type === 'change-location') {
              await attendanceService.changeLocation(action.data.clientId, action.data.location);
            }
            get().removeFromQueue(action.id);
          } catch (error) {
            console.error(`Failed to sync action ${action.id}:`, error);
            // If it's a 400 error (e.g. already checked in), we might want to remove it
            // For now, we stop syncing this queue to avoid out-of-order execution issues
            break;
          }
        }

        set({ isSyncing: false });
        await get().fetchTodayStatus();
      },

      fetchTodayStatus: async () => {
        try {
          const status = await attendanceService.getTodayStatus();
          set({ todayStatus: status });
        } catch (error) {
          console.error('Failed to fetch today status:', error);
        }
      },
    }),
    {
      name: 'attendance-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        offlineQueue: state.offlineQueue,
        todayStatus: state.todayStatus,
      }),
    }
  )
);
