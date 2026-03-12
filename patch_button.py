import re

with open('frontend/src/components/ui/Button.tsx', 'r') as f:
    content = f.read()

# Replace primary variant styles
old_primary = "'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'"
new_primary = "'bg-primary hover:bg-opacity-90 text-white shadow-md'"
content = content.replace(old_primary, new_primary)

# Replace xl size
old_size = "'h-20 px-10 text-xl'"
new_size = "'py-4 px-10 text-base'" # From mockup: py-4 (approx h-14)
content = content.replace(old_size, new_size)

with open('frontend/src/components/ui/Button.tsx', 'w') as f:
    f.write(content)

print("Button updated")
