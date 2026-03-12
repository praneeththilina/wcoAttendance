import { useState, useEffect, useMemo } from 'react';
import { adminService, type ClientFormData } from '@/services/adminService';
import { AdminBottomNav } from '@/components/layout';
import type { Client } from '@/types';

export function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    branch: '',
    city: '',
    address: '',
    latitude: undefined,
    longitude: undefined,
    isActive: true,
  });

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
        client.name.toLowerCase().includes(query) ||
        client.city.toLowerCase().includes(query) ||
        client.address?.toLowerCase().includes(query)
    );
  }, [searchQuery, clients]);

  const loadClients = async () => {
    try {
      const data = await adminService.getAllClients();
      setClients(data);
    } catch (error: any) {
      console.error('Failed to load clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      branch: '',
      city: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
      isActive: true,
    });
    setShowModal(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      branch: client.branch || '',
      city: client.city,
      address: client.address || '',
      latitude: client.latitude || undefined,
      longitude: client.longitude || undefined,
      isActive: client.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.city) {
      alert('Please fill in required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (editingClient) {
        await adminService.updateClient(editingClient.id, formData);
      } else {
        await adminService.createClient(formData);
      }
      await loadClients();
      setShowModal(false);
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Failed to save client');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminService.deleteClient(id);
      await loadClients();
      setDeleteConfirm(null);
    } catch (error: any) {
      alert(error?.response?.data?.error?.message || 'Failed to delete client');
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
        <button 
          onClick={openCreateModal}
          className="flex items-center justify-center p-2 rounded-lg bg-primary text-white hover:bg-primary/90"
        >
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
              className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-primary/5 shadow-sm hover:border-primary/20 transition-colors"
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
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => openEditModal(client)}
                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
                <button 
                  onClick={() => setDeleteConfirm(client.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminBottomNav />

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">
              {editingClient ? 'Edit Client' : 'New Client'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Client name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Branch
                </label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Main Branch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={2}
                  placeholder="Full address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-primary rounded border-slate-300"
                />
                <label htmlFor="isActive" className="text-sm text-slate-600 dark:text-slate-400">
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-lg font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : editingClient ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-sm p-6 shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Delete Client?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">
                This action cannot be undone. This will permanently delete the client.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 rounded-lg font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
