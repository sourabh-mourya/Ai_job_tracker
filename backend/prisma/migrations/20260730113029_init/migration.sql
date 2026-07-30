-- CreateTable
CREATE TABLE "Application" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "position" TEXT,
    "appliedDate" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "location" TEXT,
    "recruiter" TEXT,
    "confidence" REAL,
    "notes" TEXT,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ColdEmail" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "company" TEXT NOT NULL,
    "recruiterName" TEXT,
    "recruiterEmail" TEXT,
    "sentDate" TEXT NOT NULL,
    "followUpDate" TEXT,
    "responseReceived" BOOLEAN NOT NULL DEFAULT false,
    "responseDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Sent',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
