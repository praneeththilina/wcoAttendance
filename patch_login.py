import re

with open('frontend/src/pages/LoginPage.tsx', 'r') as f:
    content = f.read()

# Add mt-2 to Button
old_btn = '<Button\n            type="submit"\n            variant="primary"\n            size="xl"\n            isLoading={useAuthStore.getState().isLoading}\n            rightIcon={<span className="material-symbols-outlined">login</span>}\n          >'
new_btn = '<Button\n            type="submit"\n            variant="primary"\n            size="xl"\n            className="mt-2 w-full"\n            isLoading={useAuthStore.getState().isLoading}\n            rightIcon={<span className="material-symbols-outlined">login</span>}\n          >'
content = content.replace(old_btn, new_btn)


# Replace font-display
old_font = '<div className="relative flex flex-col h-auto min-h-screen w-full overflow-x-hidden pb-12">'
new_font = '<div className="relative flex flex-col h-auto min-h-screen w-full overflow-x-hidden pb-12 group/design-root">'
content = content.replace(old_font, new_font)


with open('frontend/src/pages/LoginPage.tsx', 'w') as f:
    f.write(content)

print("LoginPage updated")
