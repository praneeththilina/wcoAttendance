import re

html_file = 'new_hr_dash.html'
with open(html_file, 'r') as f:
    content = f.read()

# Extract the main content area (excluding the sidebar)
main_match = re.search(r'<main.*?>(.*?)</main>', content, re.DOTALL)
if main_match:
    main_content = main_match.group(1)
else:
    print("Could not find main content")
    exit(1)

# Now, we should inject this into HRDashboard.tsx
with open('frontend/src/pages/HRDashboard.tsx', 'r') as f:
    hr_dash = f.read()

# Replace the <main>...</main> in HRDashboard.tsx with the new one
new_main = f'<main className="flex-1 overflow-y-auto">\n{main_content}\n</main>'

# Basic replacements for React
new_main = new_main.replace('class=', 'className=')
new_main = new_main.replace('<!--', '{/*')
new_main = new_main.replace('-->', '*/}')
new_main = re.sub(r'<img(.*?)/?>', r'<img\1/>', new_main)
new_main = new_main.replace('stroke-width', 'strokeWidth')
new_main = new_main.replace('stroke-linecap', 'strokeLinecap')
new_main = new_main.replace('stroke-linejoin', 'strokeLinejoin')

print(new_main[:500])
