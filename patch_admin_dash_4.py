with open('frontend/src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# I want to remove the bottom navigation we extracted from HTML and replace it with <AdminBottomNav />
import re

# find `<nav class="fixed bottom-0` to the end, or similar
nav_pattern = r'<nav className="fixed bottom-0.*?</nav>'
content = re.sub(nav_pattern, '', content, flags=re.DOTALL)

# find the Floating action button
fab_pattern = r'\{\/\* Floating Action Button \*\/\}.*?</button>'
content = re.sub(fab_pattern, '', content, flags=re.DOTALL)

with open('frontend/src/pages/AdminDashboard.tsx', 'w') as f:
    f.write(content)
