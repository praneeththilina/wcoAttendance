with open('frontend/src/pages/AdminDashboard.tsx', 'r') as f:
    content = f.read()

# Make sure filteredStaff is used in the UI, it seems I overwrote the main tag with static HTML
# Wait, let me check the content first to see what happened to the <main> tag.
