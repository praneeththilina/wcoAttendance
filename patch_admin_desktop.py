import os

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Change the root wrapper for desktop mode
    # For Admin pages: removing max-w-[430px] and using full width. Also we can add a sidebar later or simply make it full width.
    # Currently Admin Bottom nav is fixed bottom, which is a mobile pattern. For desktop, a sidebar is better.

    # Replacing mobile layout wrapper with responsive desktop layout wrapper
    content = content.replace('max-w-[430px] mx-auto', 'w-full max-w-7xl mx-auto md:px-8 lg:px-12')

    with open(filepath, 'w') as f:
        f.write(content)

pages = [
    'frontend/src/pages/AdminDashboard.tsx',
    'frontend/src/pages/AdminClients.tsx',
    'frontend/src/pages/StaffDashboard.tsx',
    'frontend/src/pages/AdminLeaves.tsx',
    'frontend/src/pages/DailyAttendanceReport.tsx',
    'frontend/src/pages/Settings.tsx'
]

for page in pages:
    if os.path.exists(page):
        process_file(page)
        print(f"Patched {page}")
    else:
        print(f"Skipping {page}, not found.")
