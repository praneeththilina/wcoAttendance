import re

filepath = 'frontend/src/pages/EmployeeDashboard.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Fix types in EmployeeDashboard.tsx
content = content.replace("catch (error: any)", "catch (error: unknown)")

with open(filepath, 'w') as f:
    f.write(content)
print("Fixed types in EmployeeDashboard")
