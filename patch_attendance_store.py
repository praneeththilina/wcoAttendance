import re

filepath = 'frontend/src/stores/attendanceStore.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Fix types in attendanceStore.ts
content = content.replace("catch (error: any)", "catch (error: unknown)")

with open(filepath, 'w') as f:
    f.write(content)
print("Fixed types in attendanceStore")
