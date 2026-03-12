import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTheme } from '@/hooks/useTheme';
import { authService } from '@/services/auth';
import { BottomNav } from '@/components/layout';
import { ROUTES } from '@/constants';

export function Profile() {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuthStore();
  const { isDark, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [profilePicture, setProfilePicture] = useState<string | null>(user?.profilePicture || null);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProfilePicture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const updatedUser = await authService.updateProfile({
        firstName,
        lastName,
        profilePicture: profilePicture || undefined,
      });
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'manager':
        return 'Manager';
      case 'hr':
        return 'HR';
      case 'employee':
      default:
        return 'Employee';
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-md mx-auto bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className="flex items-center bg-white dark:bg-slate-900 p-4 border-b border-primary/10 sticky top-0 z-10">
          <h1 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center">
            Profile
          </h1>
        </header>

        {/* Profile Content */}
        <div className="p-4 pb-24">
          {/* Profile Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <div 
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 overflow-hidden cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-primary text-4xl">person</span>
                )}
              </div>
              <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-slate-500">{user?.email}</p>
              <span className="mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {getRoleDisplay(user?.role || 'employee')}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">badge</span>
                  <span className="text-sm">Employee ID</span>
                </div>
                <span className="font-medium text-sm">{user?.employeeId || '---'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">email</span>
                  <span className="text-sm">Email</span>
                </div>
                <span className="font-medium text-sm">{user?.email || '---'}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">phone</span>
                  <span className="text-sm">Phone</span>
                </div>
                <span className="font-medium text-sm text-slate-500">Not set</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                  <span className="text-sm">Member Since</span>
                </div>
                <span className="font-medium text-sm">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-3">
            <button 
              onClick={() => {
                setFirstName(user?.firstName || '');
                setLastName(user?.lastName || '');
                setProfilePicture(user?.profilePicture || null);
                setIsEditing(true);
              }}
              className="w-full py-3 px-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-medium text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">edit</span>
              Edit Profile
            </button>
            <button className="w-full py-3 px-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-medium text-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">lock</span>
              Change Password
            </button>
            <button
              onClick={toggleTheme}
              className="w-full py-3 px-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-medium text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">{isDark ? 'light_mode' : 'dark_mode'}</span>
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 font-medium text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>

        <BottomNav />

        {/* Edit Profile Modal */}
        {isEditing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl w-full max-w-md p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
              
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3 overflow-hidden cursor-pointer border-2 border-primary/20"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-primary text-5xl">person</span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-primary font-medium"
                >
                  Change Photo
                </button>
              </div>

              {/* First Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Last Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 py-3 px-4 bg-primary text-white rounded-lg font-medium text-sm disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
