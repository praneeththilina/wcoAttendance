import { useState, useEffect } from 'react';
import { clientService } from '@/services/auth';
import { AdminBottomNav } from '@/components/layout';
import type { Client } from '@/types';

export function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);

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
            client.city.toLowerCase().includes(query) ||
            client.address?.toLowerCase().includes(query)
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
      {/* Header */}
      <header className="flex items-center bg-background-light dark:bg-background-dark p-4 border-b border-primary/10 sticky top-0 z-10">
        <button className="text-primary dark:text-slate-100 flex size-10 shrink-0 items-center justify-center">
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
        <h1 className="text-xl font-bold leading-tight tracking-tight flex-1 ml-2">
          Clients
        </h1>
        <button className="flex items-center justify-center p-2 rounded-lg bg-primary text-white">
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      {/* Search */}
      <div className="p-4">
        <div className="flex h-12 bg-white dark:bg-slate-800 rounded-xl border border-primary/10 overflow-hidden">
          <div className="text-slate-400 flex items-center justify-center pl-4">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input
            className="w-full flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 px-4 text-sm"
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-primary/5">
            <p className="text-2xl font-bold text-primary">{clients.length}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-primary/5">
            <p className="text-2xl font-bold text-green-600">{clients.filter((c) => c.isActive).length}</p>
            <p className="text-xs text-slate-500">Active</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-primary/5">
            <p className="text-2xl font-bold text-slate-400">{clients.filter((c) => !c.isActive).length}</p>
            <p className="text-xs text-slate-500">Inactive</p>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="px-4 pb-24 space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-slate-500">Loading...</div>
        ) : filteredClients.length === 0 ? (
          <div className="text-center py-8 text-slate-500">No clients found</div>
        ) : (
          filteredClients.map((client) => (
            <div
              key={client.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5 shadow-sm hover:border-primary/20 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary">{getClientIcon(client.city)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {client.name}
                  </p>
                  {!client.isActive && (
                    <span className="text-xs text-red-500">(Inactive)</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {client.branch ? `${client.branch}, ` : ''}{client.city}
                </p>
                <p className="text-xs text-slate-400 truncate">{client.address}</p>
              </div>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          ))
        )}
      </div>

      <AdminBottomNav />
    </div>
  );
}
