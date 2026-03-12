import re

with open('frontend/src/pages/LoginPage.tsx', 'r') as f:
    content = f.read()

# Replace any
content = content.replace('catch (error: any)', 'catch (error)')

with open('frontend/src/pages/LoginPage.tsx', 'w') as f:
    f.write(content)
