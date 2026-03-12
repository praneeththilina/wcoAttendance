import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientService, attendanceService } from '@/services/auth';
import { BottomNav } from '@/components/layout';
import { ROUTES } from '@/constants';
import type { Client } from '@/types';

export function ChangeClientLocation() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredClients(
        clients.filter(
          (client) =>
            client.name.toLowerCase().includes(query) ||
            client.city.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, clients]);

  const loadClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSelect = async (client: Client) => {
    setIsChanging(true);
    try {
      const location = await getCurrentLocation();
      await attendanceService.changeLocation(client.id, location);
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      const message = error?.response?.data?.error?.message || error?.message || 'Failed to change location';
      alert(message);
      console.error('Change location failed:', message);
    } finally {
      setIsChanging(false);
    }
  };

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number; accuracy?: number }> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: 0, longitude: 0 });
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        () => resolve({ latitude: 0, longitude: 0 }),
        { enableHighAccuracy: true }
      );
    });
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
              Change Location
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
          {/* Current Location Info */}
          <div className="px-4 py-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-amber-600">info</span>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  You are currently checked in. Select a new client to change your location.
                </p>
              </div>
            </div>
          </div>

          {/* Client List */}
          <section className="px-4 py-2">
            <h3 className="text-primary dark:text-primary/60 text-xs font-bold uppercase tracking-wider mb-3">
              Available Clients
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
                    disabled={isChanging}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-primary/10 border border-primary/5 hover:border-primary/30 transition-all text-left rounded-lg disabled:opacity-50"
                  >
                    <div className="size-10 flex items-center justify-center rounded-lg bg-primary/5 text-primary">
                      <span className="material-symbols-outlined">{getClientIcon(client.city)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {client.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {client.branch ? `${client.branch}, ` : ''}{client.city}
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
      </div>
    </div>
  );
}
