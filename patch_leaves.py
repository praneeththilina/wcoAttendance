import re

filepath = 'frontend/src/pages/Leaves.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Fix types in Leaves.tsx
content = content.replace("catch (error: any)", "catch (error: unknown)")
content = content.replace("error?.response?.data?.error?.message", "((error as any)?.response?.data?.error?.message)")

with open(filepath, 'w') as f:
    f.write(content)
print("Fixed types in Leaves.tsx")
