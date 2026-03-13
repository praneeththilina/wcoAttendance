import os
import re

def add_sidebar_to_page(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Import AdminSidebar if not imported
    if 'AdminSidebar' not in content:
        # try replacing AdminBottomNav import with both
        if "import { AdminBottomNav } from '@/components/layout';" in content:
            content = content.replace(
                "import { AdminBottomNav } from '@/components/layout';",
                "import { AdminBottomNav, AdminSidebar } from '@/components/layout';"
            )
        elif "import { AdminBottomNav" in content:
            content = re.sub(
                r"import { AdminBottomNav.*? } from '@/components/layout';",
                "import { AdminBottomNav, AdminSidebar } from '@/components/layout';",
                content,
                flags=re.DOTALL
            )
        else:
            # just inject
            content = "import { AdminSidebar, AdminBottomNav } from '@/components/layout';\n" + content

    # Change root div to have flex to accommodate sidebar
    # Usually: <div className="min-h-screen bg-slate-50 dark:bg-slate-900...

    # We will replace the outermost div with a flex container and inject the sidebar.
    # To do this safely, we will find the first `return (` and inject right after it.

    parts = content.split('return (', 1)
    if len(parts) > 1:
        # It usually looks like `return (\n    <div className="min-h-screen...`
        # We wrap the existing JSX inside a flex container

        # Check if it already has AdminSidebar to avoid double wrapping
        if '<AdminSidebar />' not in parts[1]:
            # Replace the first `div` class to be flex-1 instead of min-h-screen if we're wrapping it.
            # Actually easier: wrap the whole thing in a flex container.

            new_jsx = f"""
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-display text-slate-900 dark:text-slate-100 pb-20 md:pb-0">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen relative max-w-full overflow-x-hidden">
        {parts[1].strip()[:-2]}
      </div>
    </div>
  );
"""
            # Need to fix the trailing `);`
            # Wait, `parts[1]` contains the whole JSX including `);`.
            # Let's remove the first `<div ...>` and the last `</div>` manually or just wrap the `parts[1]`.

            # Simple approach: let's use regex to find the outermost `<div className="min-h-screen...">` and replace it.

            match = re.search(r'(<div className="min-h-screen[^"]*">)', parts[1])
            if match:
                original_div = match.group(1)
                new_div = original_div.replace('min-h-screen', 'min-h-screen flex')
                parts[1] = parts[1].replace(original_div, f'{new_div}\n      <AdminSidebar />\n      <div className="flex-1 flex flex-col relative w-full overflow-x-hidden md:max-w-[calc(100vw-256px)]">', 1)

                # Now we need to close that extra div we added.
                # Find the last `</div>` before `);`
                parts[1] = parts[1].rsplit('</div>', 1)[0] + '</div>\n    </div>\n' + parts[1].rsplit('</div>', 1)[1]

                content = parts[0] + 'return (' + parts[1]

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
        try:
            add_sidebar_to_page(page)
            print(f"Added sidebar to {page}")
        except Exception as e:
            print(f"Failed {page}: {e}")
