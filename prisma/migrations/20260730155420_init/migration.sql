-- CreateTable
CREATE TABLE "Application" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT,
    "appliedDate" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Applied',
    "location" TEXT,
    "recruiter" TEXT,
    "confidence" DOUBLE PRECISION,
    "notes" TEXT,
    "tags" TEXT,
    "imageHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColdEmail" (
    "id" SERIAL NOT NULL,
    "company" TEXT NOT NULL,
    "recruiterName" TEXT,
    "recruiterEmail" TEXT,
    "sentDate" TEXT NOT NULL,
    "followUpDate" TEXT,
    "responseReceived" BOOLEAN NOT NULL DEFAULT false,
    "responseDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Sent',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColdEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_imageHash_key" ON "Application"("imageHash");
