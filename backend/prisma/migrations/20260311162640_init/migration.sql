-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('employee', 'admin', 'manager', 'hr');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('sick', 'annual', 'unpaid', 'other');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'employee',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branch" TEXT,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendanceRecords" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL,
    "checkOutTime" TIMESTAMP(3),
    "checkInLocation" JSONB,
    "checkOutLocation" JSONB,
    "totalHours" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'checked_in',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendanceRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locationChanges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromClientId" TEXT,
    "toClientId" TEXT NOT NULL,
    "location" JSONB,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locationChanges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaveBalances" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "sickLeaveTotal" INTEGER NOT NULL DEFAULT 7,
    "sickLeaveUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "annualLeaveTotal" INTEGER NOT NULL DEFAULT 15,
    "annualLeaveUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unpaidLeaveUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "otherLeaveUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaveBalances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaveRequests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "LeaveType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'pending',
    "days" DOUBLE PRECISION NOT NULL,
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "leaveRequests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeId_key" ON "users"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_employeeId_idx" ON "users"("employeeId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "clients_name_idx" ON "clients"("name");

-- CreateIndex
CREATE INDEX "clients_city_idx" ON "clients"("city");

-- CreateIndex
CREATE INDEX "clients_isActive_idx" ON "clients"("isActive");

-- CreateIndex
CREATE INDEX "attendanceRecords_userId_idx" ON "attendanceRecords"("userId");

-- CreateIndex
CREATE INDEX "attendanceRecords_clientId_idx" ON "attendanceRecords"("clientId");

-- CreateIndex
CREATE INDEX "attendanceRecords_checkInTime_idx" ON "attendanceRecords"("checkInTime");

-- CreateIndex
CREATE INDEX "attendanceRecords_status_idx" ON "attendanceRecords"("status");

-- CreateIndex
CREATE INDEX "attendanceRecords_userId_checkInTime_idx" ON "attendanceRecords"("userId", "checkInTime");

-- CreateIndex
CREATE INDEX "locationChanges_userId_idx" ON "locationChanges"("userId");

-- CreateIndex
CREATE INDEX "locationChanges_changedAt_idx" ON "locationChanges"("changedAt");

-- CreateIndex
CREATE UNIQUE INDEX "leaveBalances_userId_year_key" ON "leaveBalances"("userId", "year");

-- CreateIndex
CREATE INDEX "leaveRequests_userId_idx" ON "leaveRequests"("userId");

-- CreateIndex
CREATE INDEX "leaveRequests_status_idx" ON "leaveRequests"("status");

-- AddForeignKey
ALTER TABLE "attendanceRecords" ADD CONSTRAINT "attendanceRecords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendanceRecords" ADD CONSTRAINT "attendanceRecords_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locationChanges" ADD CONSTRAINT "locationChanges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaveBalances" ADD CONSTRAINT "leaveBalances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaveRequests" ADD CONSTRAINT "leaveRequests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
