import re

with open('frontend/src/pages/EmployeeDashboard.tsx', 'r') as f:
    content = f.read()

# Update check in button text
old_btn = '<span className="text-lg font-bold">Check In</span>'
new_btn = '<span className="text-lg font-bold">{isCheckedIn ? "Update Location" : "Check In"}</span>'
content = content.replace(old_btn, new_btn)

# Make BottomNav sticky bottom inside a safe area if needed (already is fixed bottom)

# Fix type errors in store
with open('frontend/src/stores/attendanceStore.ts', 'r') as f:
    store_content = f.read()

store_content = store_content.replace('catch (error) {', 'catch (error: any) {')

with open('frontend/src/stores/attendanceStore.ts', 'w') as f:
    f.write(store_content)

with open('frontend/src/pages/EmployeeDashboard.tsx', 'w') as f:
    f.write(content)
