import re

with open('frontend/src/pages/CheckOutScreen.tsx', 'r') as f:
    content = f.read()

content = content.replace("  const hoursWorked = status?.totalHours || 0;", "  const hoursWorked = liveDuration ? parseFloat(liveDuration) : (status?.totalHours || 0);")

with open('frontend/src/pages/CheckOutScreen.tsx', 'w') as f:
    f.write(content)
