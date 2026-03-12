-- Supabase SQL for AA Attendance System
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (camelCase to match Prisma schema)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "employeeId" VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'employee',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table (camelCase to match Prisma schema)
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    branch VARCHAR(100),
    city VARCHAR(100) NOT NULL,
    address TEXT,
    latitude FLOAT,
    longitude FLOAT,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Records table (camelCase to match Prisma schema)
CREATE TABLE IF NOT EXISTS "attendanceRecords" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "clientId" UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    "checkInTime" TIMESTAMPTZ NOT NULL,
    "checkOutTime" TIMESTAMPTZ,
    "checkInLocation" JSONB,
    "checkOutLocation" JSONB,
    "totalHours" FLOAT,
    status VARCHAR(20) NOT NULL DEFAULT 'checked_in',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Location Changes table (camelCase to match Prisma schema)
CREATE TABLE IF NOT EXISTS "locationChanges" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "fromClientId" UUID REFERENCES clients(id) ON DELETE SET NULL,
    "toClientId" UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    location JSONB,
    "changedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for Users
CREATE INDEX IF NOT EXISTS "users_email_idx" ON users(email);
CREATE INDEX IF NOT EXISTS "users_employeeId_idx" ON users("employeeId");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON users(role);

-- Create indexes for Clients
CREATE INDEX IF NOT EXISTS "clients_name_idx" ON clients(name);
CREATE INDEX IF NOT EXISTS "clients_city_idx" ON clients(city);
CREATE INDEX IF NOT EXISTS "clients_isActive_idx" ON clients("isActive");

-- Create indexes for Attendance Records
CREATE INDEX IF NOT EXISTS "attendanceRecords_userId_idx" ON "attendanceRecords"("userId");
CREATE INDEX IF NOT EXISTS "attendanceRecords_clientId_idx" ON "attendanceRecords"("clientId");
CREATE INDEX IF NOT EXISTS "attendanceRecords_checkInTime_idx" ON "attendanceRecords"("checkInTime");
CREATE INDEX IF NOT EXISTS "attendanceRecords_status_idx" ON "attendanceRecords"(status);
CREATE INDEX IF NOT EXISTS "attendanceRecords_user_checkIn_idx" ON "attendanceRecords"("userId", "checkInTime");

-- Create indexes for Location Changes
CREATE INDEX IF NOT EXISTS "locationChanges_userId_idx" ON "locationChanges"("userId");
CREATE INDEX IF NOT EXISTS "locationChanges_changedAt_idx" ON "locationChanges"("changedAt");

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_attendanceRecords_updated_at ON "attendanceRecords";
CREATE TRIGGER update_attendanceRecords_updated_at BEFORE UPDATE ON "attendanceRecords"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE "attendanceRecords" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "locationChanges" ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow all for authenticated users" ON users;
CREATE POLICY "Allow all for authenticated users" ON users FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for clients" ON clients;
CREATE POLICY "Allow all for clients" ON clients FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for attendance_records" ON "attendanceRecords";
CREATE POLICY "Allow all for attendance_records" ON "attendanceRecords" FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all for location_changes" ON "locationChanges";
CREATE POLICY "Allow all for location_changes" ON "locationChanges" FOR ALL USING (true);
