import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UISettings {
  dashboardVariant: 1 | 2;
  checkInVariant: 1 | 2;
  checkOutVariant: 1 | 2;
  setDashboardVariant: (variant: 1 | 2) => void;
  setCheckInVariant: (variant: 1 | 2) => void;
  setCheckOutVariant: (variant: 1 | 2) => void;
}

export const useUISettings = create<UISettings>()(
  persist(
    (set) => ({
      dashboardVariant: 1,
      checkInVariant: 1,
      checkOutVariant: 1,
      setDashboardVariant: (variant) => set({ dashboardVariant: variant }),
      setCheckInVariant: (variant) => set({ checkInVariant: variant }),
      setCheckOutVariant: (variant) => set({ checkOutVariant: variant }),
    }),
    {
      name: 'ui-settings',
    }
  )
);
