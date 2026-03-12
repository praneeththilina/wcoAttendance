import re

html_file = 'new_admin_dash.html'
with open(html_file, 'r') as f:
    content = f.read()

body_match = re.search(r'<body.*?>(.*?)</body>', content, re.DOTALL)
if not body_match:
    print("Could not find body content")
    exit(1)
body_content = body_match.group(1)

# Basic replacements for React
new_body = f'<div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 pb-20">\n{body_content}\n<AdminBottomNav />\n</div>'
new_body = new_body.replace('class=', 'className=')
new_body = new_body.replace('<!--', '{/*')
new_body = new_body.replace('-->', '*/}')
new_body = re.sub(r'<img\s+([^>]*?)(?<!/)>', r'<img \1/>', new_body)
new_body = re.sub(r'<input\s+([^>]*?)(?<!/)>', r'<input \1/>', new_body)

# Replace stats
new_body = new_body.replace('1,250', '{stats.totalEmployees}')
new_body = new_body.replace('940', '{stats.checkedIn}')
new_body = new_body.replace('600', '{stats.atOffice}')
new_body = new_body.replace('340', '{stats.atClientSites}')

# Update search input
new_body = new_body.replace('placeholder="Search staff members..."', 'placeholder="Search staff members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}')

# Now the Staff List.
# It starts with "<!-- Staff List -->" and ends before "<nav" or similar
# Let's find "<!-- Staff List -->" and the next section.
staff_list_pattern = r'\{\/\* Staff List \*\/\}(.*?)<nav'
staff_match = re.search(staff_list_pattern, new_body, re.DOTALL)

react_staff = """{/* Staff List */}
<div className="flex flex-col px-4 pb-24 gap-3">
  {isLoading ? (
    <div className="text-center py-8 text-slate-500">Loading live status...</div>
  ) : filteredStaff.length === 0 ? (
    <div className="text-center py-8 text-slate-500 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">No staff found matching search.</div>
  ) : (
    filteredStaff.map((member) => (
      <div key={member.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <div className="size-12 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
               {member.firstName[0]}{member.lastName[0]}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">{member.firstName} {member.lastName}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
            </div>
          </div>
          <StatusBadge status={member.status} />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-sm">
                {member.status === 'travel' ? 'commute' : member.status === 'checked_out' ? 'home' : 'location_on'}
            </span>
            <span className="text-xs font-semibold line-clamp-1 max-w-[150px]">
                {member.clientName
                    ? `${member.clientName}${member.clientCity ? `, ${member.clientCity}` : ''}`
                    : member.status === 'checked_out'
                    ? 'Checked Out'
                    : 'Not at a site'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="text-xs font-semibold">{member.checkInTime || '---'}</span>
          </div>
        </div>
      </div>
    ))
  )}
</div>
<nav"""

if staff_match:
    new_body = new_body.replace(staff_match.group(0), react_staff)

# remove style tags and what is after it (we use tailwind)
new_body = re.sub(r'<style>.*?</style>', '', new_body, flags=re.DOTALL)

layout = f"""import {{ useState, useEffect }} from 'react';
import {{ AdminBottomNav }} from '@/components/layout';
import {{ StatusBadge }} from '@/components/ui';
import {{ adminService }} from '@/services/adminService';

interface LocalStaffMember {{
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'checked_in' | 'checked_out' | 'incomplete' | 'travel' | 'not_checked_in';
  clientName?: string;
  clientCity?: string;
  checkInTime?: string;
}}

interface DashboardStats {{
  totalEmployees: number;
  checkedIn: number;
  atOffice: number;
  atClientSites: number;
}}

export function AdminDashboard() {{
  const [staff, setStaff] = useState<LocalStaffMember[]>([]);
  const [stats, setStats] = useState<DashboardStats>({{
    totalEmployees: 0,
    checkedIn: 0,
    atOffice: 0,
    atClientSites: 0,
  }});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {{
    loadDashboard();
    const interval = setInterval(() => loadDashboard(false), 30000); // Live sync every 30s
    return () => clearInterval(interval);
  }}, []);

  const loadDashboard = async (showLoading = true) => {{
    try {{
      if (showLoading) setIsLoading(true);
      const data = await adminService.getDashboardStats();
      setStaff(data.liveStaff);
      setStats({{
        totalEmployees: data.totalEmployees,
        checkedIn: data.checkedIn,
        atOffice: data.atOffice,
        atClientSites: data.atClientSites,
      }});
    }} catch (error: any) {{
      console.error('Failed to load dashboard:', error);
    }} finally {{
      setIsLoading(false);
    }}
  }};

  const filteredStaff = staff.filter(
    (member) =>
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    {new_body}
  );
}}
"""

with open('frontend/src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(layout)

print("Replaced AdminDashboard.tsx successfully")
