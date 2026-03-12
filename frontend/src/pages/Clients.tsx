import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { clientService } from '@/services/auth';
import type { Client } from '@/types';

export function Clients() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      const data = await clientService.getAll();
      setClients(data);
    } catch (error: any) {
      console.error('Failed to load clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 pb-20">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-bold">Manage Clients</h1>
        </div>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <button className="bg-primary text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors text-sm font-bold">
            <span className="material-symbols-outlined text-sm">add</span> New Client
          </button>
        )}
      </header>
      
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <div className="relative mb-6">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Search clients or cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-slate-500">Loading clients...</div>
          ) : filteredClients.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">No clients found matching "{search}"</div>
          ) : (
            filteredClients.map((client) => (
              <div key={client.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">domain</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-sm">edit</span></button>
                  </div>
                </div>
                <h3 className="font-bold text-lg truncate mb-1" title={client.name}>{client.name}</h3>
                <p className="text-sm text-slate-500 mb-4 truncate">{client.branch || 'Main Branch'}</p>
                
                <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined text-base shrink-0 mt-0.5">location_on</span>
                  <p className="line-clamp-2">{client.address || client.city}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
