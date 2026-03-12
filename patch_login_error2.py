import re

with open('frontend/src/pages/LoginPage.tsx', 'r') as f:
    content = f.read()

# Replace error typing
content = content.replace('catch (error) {', 'catch (error: any) {')

with open('frontend/src/pages/LoginPage.tsx', 'w') as f:
    f.write(content)
