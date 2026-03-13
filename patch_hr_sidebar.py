import re
import os

filepath = 'frontend/src/pages/HRDashboard.tsx'

with open(filepath, 'r') as f:
    content = f.read()

# Replace the HR Sidebar with AdminSidebar component for consistency
if "import { AdminSidebar } from '@/components/layout';" not in content:
    content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate } from 'react-router-dom';\nimport { AdminSidebar } from '@/components/layout';")

# Find the start of aside
aside_start = content.find('<aside className="w-64 border-r')
if aside_start != -1:
    aside_end = content.find('</aside>', aside_start) + len('</aside>')
    content = content[:aside_start] + '<AdminSidebar />' + content[aside_end:]

with open(filepath, 'w') as f:
    f.write(content)
print("Updated HRDashboard sidebar")
