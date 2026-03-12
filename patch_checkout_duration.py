import re

with open('frontend/src/pages/CheckOutScreen.tsx', 'r') as f:
    content = f.read()

# Replace totalHours usage correctly
old_hours = "{status?.totalHours ? `${status.totalHours.toFixed(2)}h` : '0.0h'}"
new_hours = "{liveDuration || '0.0h'}"
content = content.replace(old_hours, new_hours)

with open('frontend/src/pages/CheckOutScreen.tsx', 'w') as f:
    f.write(content)
