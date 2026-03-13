import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService } from '@/services/auth';
import { useAttendanceStore } from '@/stores/attendanceStore';
import { useLocationValidation } from '@/hooks/useLocationValidation';
import { BottomNav } from '@/components/layout';
import { ROUTES } from '@/constants';
import type { Client } from '@/types';

export function ClientSelection() {
  const navigate = useNavigate();
  const { addToQueue, isOnline, setTodayStatus } = useAttendanceStore();
  const { fetchAndValidate, isLoading: isValidatingLocation } = useLocationValidation();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    if (searchQuery.trim() === '') {
      return clients;
    }
    const query = searchQuery.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(query) || client.city.toLowerCase().includes(query)
    );
  }, [searchQuery, clients]);

  const loadClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error: any) {
      console.error('Failed to load clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setShowConfirmModal(true);
  };

  const confirmCheckIn = async () => {
    if (!selectedClient) return;
    const client = selectedClient;
    setIsCheckingIn(true);
    setShowConfirmModal(false);
    setLocationError(null);

    try {
      const clientLocation =
        client.latitude && client.longitude
          ? { latitude: client.latitude, longitude: client.longitude, radius: 500 }
          : undefined;

      const validation = await fetchAndValidate(clientLocation);

      if (!validation || !validation.location) {
        setLocationError('Failed to get location. Please enable GPS and try again.');
        setIsCheckingIn(false);
        return;
      }

      if (!validation.isValid) {
        setLocationError(validation.errors.join('. '));
        setIsCheckingIn(false);
        return;
      }

      const location = {
        latitude: validation.location.latitude,
        longitude: validation.location.longitude,
        accuracy: validation.location.accuracy,
      };

      if (isOnline) {
        const { attendanceService } = await import('@/services/auth');
        await attendanceService.checkIn(client.id, location);
      } else {
        addToQueue({
          type: 'check-in',
          data: { clientId: client.id, location },
        });

        setTodayStatus({
          status: 'checked_in',
          checkInTime: new Date().toISOString(),
          checkOutTime: null,
          clientId: client.id,
          clientName: client.name,
          totalHours: null,
        });
      }

      navigate(ROUTES.CHECKIN_CONFIRMATION, {
        state: {
          clientName: client.name,
          clientCity: client.city,
          checkInTime: new Date().toISOString(),
          isOffline: !isOnline,
        },
      });
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Check-in failed';
      setLocationError(message);
      console.error('Check-in failed:', message);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const getClientIcon = (city: string) => {
    const icons: Record<string, string> = {
      'New York': 'business',
      'San Francisco': 'terminal',
      Chicago: 'account_balance',
      Boston: 'account_balance',
      'Los Angeles': 'local_hospital',
      Miami: 'storefront',
      Seattle: 'computer',
      Austin: 'tv',
    };
    return icons[city] || 'business';
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
          <div className="flex items-center p-4 justify-between">
            <button
              onClick={() => navigate(-1)}
              className="text-primary dark:text-primary/80 flex size-10 items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 px-2 text-center">
              Select Location
            </h2>
            <div className="size-10" />
          </div>
          <div className="px-4 pb-4">
            <label className="flex flex-col w-full">
              <div className="flex w-full items-stretch h-12 bg-primary/5 dark:bg-primary/20 border border-primary/10 rounded-lg">
                <div className="text-primary/60 flex items-center justify-center pl-4">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input
                  className="form-input flex w-full border-none bg-transparent focus:ring-0 text-slate-900 dark:text-slate-100 placeholder:text-primary/40 px-3 text-base font-normal"
                  placeholder="Search clients or offices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </label>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {/* Quick Actions */}
          <section className="px-4 py-2">
            <h3 className="text-primary dark:text-primary/60 text-xs font-bold uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col gap-2 border border-primary/10 bg-white dark:bg-primary/10 p-4 items-center justify-center text-center hover:border-primary transition-all group rounded-lg shadow-sm">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">corporate_fare</span>
                </div>
                <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                  HQ Office
                </span>
              </button>
              <button className="flex flex-col gap-2 border border-primary/10 bg-white dark:bg-primary/10 p-4 items-center justify-center text-center hover:border-primary transition-all group rounded-lg shadow-sm">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-2xl">commute</span>
                </div>
                <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold">
                  Travel
                </span>
              </button>
            </div>
          </section>

          {/* Client List */}
          <section className="px-4 py-6">
            <h3 className="text-primary dark:text-primary/60 text-xs font-bold uppercase tracking-wider mb-3">
              Pre-Approved Clients
            </h3>
            <div className="flex flex-col gap-2">
              {isLoading ? (
                <div className="text-center py-8 text-slate-500">Loading clients...</div>
              ) : filteredClients.length === 0 ? (
                <div className="text-center py-8 text-slate-500">No clients found</div>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleClientSelect(client)}
                    disabled={isCheckingIn}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-primary/10 border border-primary/5 hover:border-primary/30 transition-all text-left rounded-lg disabled:opacity-50"
                  >
                    <div className="size-10 flex items-center justify-center rounded-lg bg-primary/5 text-primary">
                      <span className="material-symbols-outlined">
                        {getClientIcon(client.city)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {client.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {client.branch ? `${client.branch}, ` : ''}
                        {client.city}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 text-sm">
                      chevron_right
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>
        </main>

        <div className="h-20" />
        <BottomNav />

        {/* Confirmation Modal */}
        {showConfirmModal && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-background-dark rounded-xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    location_on
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">Confirm Check-In</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  Are you sure you want to check in to{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedClient.name}
                  </span>
                  ?
                </p>
                {locationError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
                    <p className="text-red-600 dark:text-red-400 text-sm">{locationError}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowConfirmModal(false);
                      setLocationError(null);
                    }}
                    className="flex-1 py-3 rounded-lg font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCheckIn}
                    disabled={isCheckingIn || isValidatingLocation}
                    className="flex-1 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isCheckingIn || isValidatingLocation ? 'Validating...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
