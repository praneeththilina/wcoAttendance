import { useLocation, useNavigate } from 'react-router-dom';
import { useUISettings } from '@/stores/uiSettings';
import { ROUTES } from '@/constants';

interface LocationState {
  clientName?: string;
  clientCity?: string;
  checkInTime?: string;
  isOffline?: boolean;
}

export function CheckinConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const { checkInVariant, setCheckInVariant } = useUISettings();

  const isVariant1 = checkInVariant === 1;
  const isOffline = state?.isOffline || false;

  const clientName = state?.clientName || 'Client Location';
  const clientCity = state?.clientCity || 'Unknown';
  const checkInTime = state?.checkInTime ? new Date(state.checkInTime) : new Date();

  const formattedDate = checkInTime.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });

  const formattedTime = checkInTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-md mx-auto bg-background-light dark:bg-background-dark overflow-x-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center p-4 pb-2 justify-between">
          <button onClick={() => navigate(-1)} className="text-primary dark:text-slate-100 flex size-12 shrink-0 items-center justify-start">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h2 className="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-12">
            Check-in Status
          </h2>
          <button
            onClick={() => setCheckInVariant(isVariant1 ? 2 : 1)}
            className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold"
          >
            v{checkInVariant}
          </button>
        </div>

        {/* Success Content */}
        <div className="flex flex-col px-6 py-8">
          <div className="flex flex-col items-center gap-6">
            <div className={`flex items-center justify-center rounded-full p-6 ${isOffline ? 'bg-amber-100' : 'bg-success/10'}`}>
              <span className={`material-symbols-outlined text-7xl font-bold ${isOffline ? 'text-amber-600' : 'text-success'}`}>
                {isOffline ? 'cloud_upload' : 'check_circle'}
              </span>
            </div>
            <div className="flex max-w-full flex-col items-center gap-2">
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-center">
                {isOffline ? 'Saved Offline' : 'Checked In Successfully'}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base font-normal leading-normal text-center">
                {isOffline 
                  ? 'Your attendance has been saved locally and will sync automatically when you are back online.'
                  : "Your attendance for today's audit has been securely recorded."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="px-4 @container">
          <div className={`flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm ${
            isVariant1 ? 'rounded-xl' : 'rounded-lg'
          }`}>
            {/* Map Placeholder */}
            <div className="w-full h-24 bg-primary/10 bg-cover bg-center flex items-center justify-center">
              <span className="material-symbols-outlined text-primary/40 text-4xl">map</span>
            </div>

            <div className="flex flex-col p-5 gap-4">
              {/* Client Location */}
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isVariant1 ? 'bg-primary/10' : 'bg-primary/5'}`}>
                  <span className="material-symbols-outlined text-primary">corporate_fare</span>
                </div>
                <div className="flex flex-col">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Client Location
                  </p>
                  <p className="text-slate-900 dark:text-slate-100 text-base font-bold">
                    {clientName}
                  </p>
                  <p className="text-slate-500 text-sm">{clientCity}</p>
                </div>
              </div>

              {/* Time and Date */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Check-In Time
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-slate-400 text-sm">schedule</span>
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-medium">
                      {formattedTime}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    Date
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-slate-400 text-sm">
                      calendar_today
                    </span>
                    <p className="text-slate-900 dark:text-slate-100 text-sm font-medium">
                      {formattedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto p-6 flex flex-col gap-3">
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className={`w-full py-4 px-6 bg-primary text-white font-bold flex items-center justify-center gap-2 ${
              isVariant1 
                ? 'rounded-xl shadow-lg shadow-primary/20' 
                : 'rounded-lg shadow-sm'
            }`}
          >
            <span>Go to Dashboard</span>
            <span className="material-symbols-outlined text-lg">dashboard</span>
          </button>
          <button
            onClick={() => navigate(ROUTES.CLIENT_SELECTION)}
            className={`w-full py-4 px-6 font-bold flex items-center justify-center gap-2 ${
              isVariant1 
                ? 'bg-transparent border-2 border-primary/20 text-primary dark:text-slate-300 rounded-xl' 
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg'
            }`}
          >
            <span>Change Client</span>
            <span className="material-symbols-outlined text-lg">edit_location_alt</span>
          </button>
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}
