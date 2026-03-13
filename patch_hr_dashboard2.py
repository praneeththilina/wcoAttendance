import re

filepath = 'frontend/src/pages/HRDashboard.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Fix types in HRDashboard.tsx
content = content.replace("todaysAttendance: Record<string, unknown>[];", """todaysAttendance: {
    id: string;
    user: { firstName: string; lastName: string; employeeId: string; };
    client?: { name: string; city: string; };
    checkInTime: string;
    status: string;
  }[];""")

with open(filepath, 'w') as f:
    f.write(content)
print("Fixed types in HRDashboard")
