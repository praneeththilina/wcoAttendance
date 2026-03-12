import re

html_file = 'new_hr_dash.html'
with open(html_file, 'r') as f:
    content = f.read()

# Extract the <main> block
main_match = re.search(r'<main.*?>(.*?)</main>', content, re.DOTALL)
if not main_match:
    print("Could not find main content")
    exit(1)
main_content = main_match.group(1)

# Basic replacements for React
new_main = f'<main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900/50">\n{main_content}\n</main>'
new_main = new_main.replace('class=', 'className=')
new_main = new_main.replace('<!--', '{/*')
new_main = new_main.replace('-->', '*/}')
new_main = re.sub(r'<img\s+([^>]*?)(?<!/)>', r'<img \1/>', new_main)
new_main = re.sub(r'<input\s+([^>]*?)(?<!/)>', r'<input \1/>', new_main)

# Replace static values with React variables where possible
new_main = new_main.replace('1,250', '{isLoading ? "-" : stats?.totalEmployees || 0}')
new_main = new_main.replace('940', '{isLoading ? "-" : stats?.activeToday || 0}')
new_main = new_main.replace('98.5%', '{isLoading ? "-" : `${(stats?.complianceRate || 0).toFixed(1)}%`}')

# We need to replace the static table body with mapping over stats.todaysAttendance
# The table body looks like this:
tbody_pattern = r'<tbody className="divide-y divide-slate-100 dark:divide-slate-800">(.*?)</tbody>'
tbody_match = re.search(tbody_pattern, new_main, re.DOTALL)

if tbody_match:
    react_tbody = """<tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading data...</td>
                  </tr>
                ) : !stats?.todaysAttendance?.length ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No attendance records for today.</td>
                  </tr>
                ) : (
                  stats.todaysAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-slate-500">
                            {record.user.firstName[0]}{record.user.lastName[0]}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">{record.user.firstName} {record.user.lastName}</div>
                            <div className="text-xs text-slate-500">{record.user.employeeId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-slate-100">{record.client?.name || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{record.client?.city || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                           {new Date(record.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${
                          record.status === 'checked_in' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' :
                          record.status === 'checked_out' ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20' :
                          'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            record.status === 'checked_in' ? 'bg-green-500' :
                            record.status === 'checked_out' ? 'bg-slate-500' :
                            'bg-amber-500'
                          }`}></span>
                          {record.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary hover:text-primary/80 transition-colors">
                          <span className="material-symbols-outlined text-xl">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>"""
    new_main = new_main.replace(tbody_match.group(0), react_tbody)

# Create layout with Sidebar + Main content
layout = f"""import {{ useState, useEffect }} from 'react';
import {{ useNavigate }} from 'react-router-dom';
import {{ useAuthStore }} from '@/stores/authStore';
import {{ ROUTES }} from '@/constants';
import apiClient from '@/services/api';

interface DashboardStats {{
  totalEmployees: number;
  activeToday: number;
  complianceRate: number;
  todaysAttendance: any[];
}}

export function HRDashboard() {{
  const navigate = useNavigate();
  const {{ user, logout }} = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {{
    loadData();
  }}, []);

  const loadData = async () => {{
    try {{
      setIsLoading(true);
      const response = await apiClient.get('/hr/dashboard');
      setStats(response.data.data);
    }} catch (error: any) {{
      console.error('Failed to load HR dashboard:', error);
    }} finally {{
      setIsLoading(false);
    }}
  }};

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {{/* Sidebar */}}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="bg-primary text-white p-2 rounded-lg">
            <span className="material-symbols-outlined">corporate_fare</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">HR Portal</h1>
            <p className="text-xs text-slate-500">Enterprise Admin</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-sm">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={{() => navigate(ROUTES.ADMIN_CLIENTS)}}>
            <span className="material-symbols-outlined">business</span>
            <span className="text-sm">Clients</span>
          </a>
          <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={{() => navigate(ROUTES.ADMIN_LEAVES)}}>
            <span className="material-symbols-outlined">event_busy</span>
            <span className="text-sm">Leave Management</span>
          </a>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">System</p>
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer" onClick={{() => {{ logout(); navigate(ROUTES.LOGIN); }}}}>
              <span className="material-symbols-outlined text-red-500">logout</span>
              <span className="text-sm font-medium text-red-500">Logout</span>
            </a>
          </div>
        </nav>
      </aside>

      {new_main}
    </div>
  );
}}
"""

with open('frontend/src/pages/HRDashboard.tsx', 'w') as f:
    f.write(layout)

print("Replaced HRDashboard.tsx successfully")
