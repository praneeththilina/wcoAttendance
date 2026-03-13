import re

filepath = 'frontend/src/pages/HRDashboard.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Fix unused vars in HRDashboard.tsx
content = content.replace("import { useNavigate } from 'react-router-dom';", "")
content = content.replace("const navigate = useNavigate();", "")
content = content.replace("const { logout } = useAuthStore();", "")
content = content.replace("import { ROUTES } from '@/constants';", "")

with open(filepath, 'w') as f:
    f.write(content)
print("Fixed unused vars in HRDashboard")
