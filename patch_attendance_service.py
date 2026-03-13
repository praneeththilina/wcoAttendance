import re

filepath = 'backend/src/services/attendanceService.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Make checkOut calculate overtime and late arrivals.
# Currently totalHours is calculated in checkOut.
# We will flag overtime if totalHours > 8.5 (assuming standard 8.5h workday including 30m break).

# This requires updating the schema to add overtimeHours, but we can just return it in the result or store it in JSON for now.
# Instead of modifying the DB schema, we'll just compute it dynamically.
# totalHours is already saved! We can just use that.

# Just to be safe, I'll update checkOut to also return overtime metrics.

replacement = """  const checkOutTime = new Date();
  const checkInTime = new Date(attendance.checkInTime);
  const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

  // Standard work hours: 8.5 hours (8 hours work + 30 mins break)
  const standardHours = 8.5;
  const overtimeHours = totalHours > standardHours ? parseFloat((totalHours - standardHours).toFixed(2)) : 0;
  const isLate = checkInTime.getHours() > 8 || (checkInTime.getHours() === 8 && checkInTime.getMinutes() > 30);

  const updated = await prisma.attendanceRecord.update({
    where: { id: attendance.id },
    data: {
      checkOutTime,
      checkOutLocation: location || undefined,
      totalHours: parseFloat(totalHours.toFixed(2)),
      status: 'checked_out',
    },
    include: {
      client: true,
      user: {
"""

if "const overtimeHours =" not in content:
    content = content.replace("""  const checkOutTime = new Date();
  const checkInTime = new Date(attendance.checkInTime);
  const totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

  const updated = await prisma.attendanceRecord.update({
    where: { id: attendance.id },
    data: {
      checkOutTime,
      checkOutLocation: location || undefined,
      totalHours: parseFloat(totalHours.toFixed(2)),
      status: 'checked_out',
    },
    include: {
      client: true,
      user: {""", replacement)

    # Update return to include these metrics
    content = content.replace("return {\n    ...updated,\n  };", """return {
    ...updated,
    overtimeHours,
    isLate
  };""")

with open(filepath, 'w') as f:
    f.write(content)

print("Updated attendanceService checkOut to calculate overtime metrics")
