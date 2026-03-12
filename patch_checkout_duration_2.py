import re

with open('frontend/src/pages/CheckOutScreen.tsx', 'r') as f:
    content = f.read()

content = content.replace("{status?.totalHours ? `${status.totalHours.toFixed(1)}h` : '0.0h'}", "{liveDuration || '0.0h'}")
content = content.replace("{status?.totalHours ? `${status.totalHours.toFixed(1)}h` : '---'}", "{liveDuration || '---'}")

with open('frontend/src/pages/CheckOutScreen.tsx', 'w') as f:
    f.write(content)
