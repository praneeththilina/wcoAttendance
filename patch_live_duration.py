import re

with open('frontend/src/pages/EmployeeDashboard.tsx', 'r') as f:
    content = f.read()

# Add a live duration state and effect
state_injection = """  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showVariantToggle, setShowVariantToggle] = useState(false);
  const [liveDuration, setLiveDuration] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status?.status === 'checked_in' && status.checkInTime) {
      const updateDuration = () => {
        const checkInDate = new Date(status.checkInTime as string);
        const now = new Date();
        const diffInMs = Math.abs(now.getTime() - checkInDate.getTime());
        const diffInHrs = diffInMs / (1000 * 60 * 60);
        setLiveDuration(`${diffInHrs.toFixed(1)}h`);
      };
      updateDuration(); // initial call
      interval = setInterval(updateDuration, 60000); // update every minute
    } else {
      setLiveDuration(status?.totalHours ? `${status.totalHours.toFixed(1)}h` : '---');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);"""

content = content.replace("  const [isCheckingIn, setIsCheckingIn] = useState(false);\n  const [showVariantToggle, setShowVariantToggle] = useState(false);", state_injection)

# Replace totalHours usage
old_hours = "{status?.totalHours ? `${status.totalHours.toFixed(1)}h` : '---'}"
new_hours = "{liveDuration}"
content = content.replace(old_hours, new_hours)

with open('frontend/src/pages/EmployeeDashboard.tsx', 'w') as f:
    f.write(content)

# Do the same for CheckOutScreen
with open('frontend/src/pages/CheckOutScreen.tsx', 'r') as f:
    checkout_content = f.read()

checkout_state_injection = """  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [liveDuration, setLiveDuration] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status?.status === 'checked_in' && status.checkInTime) {
      const updateDuration = () => {
        const checkInDate = new Date(status.checkInTime as string);
        const now = new Date();
        const diffInMs = Math.abs(now.getTime() - checkInDate.getTime());
        const diffInHrs = diffInMs / (1000 * 60 * 60);
        setLiveDuration(`${diffInHrs.toFixed(1)}h`);
      };
      updateDuration(); // initial call
      interval = setInterval(updateDuration, 60000); // update every minute
    } else {
      setLiveDuration(status?.totalHours ? `${status.totalHours.toFixed(1)}h` : '---');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);"""

checkout_content = checkout_content.replace("  const [isCheckingOut, setIsCheckingOut] = useState(false);", checkout_state_injection)

checkout_old_hours = "{status?.totalHours ? `${status.totalHours.toFixed(1)}h` : '0.0h'}"
checkout_new_hours = "{liveDuration || '0.0h'}"
checkout_content = checkout_content.replace(checkout_old_hours, checkout_new_hours)

with open('frontend/src/pages/CheckOutScreen.tsx', 'w') as f:
    f.write(checkout_content)

print("Live duration implemented.")
