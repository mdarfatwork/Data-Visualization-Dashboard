-- CreateTable
CREATE TABLE "SharedChart" (
    "id" TEXT NOT NULL,
    "ownerEmail" TEXT NOT NULL,
    "receiverEmails" TEXT[],
    "encryptedUrl" TEXT NOT NULL,
    "filter" JSONB NOT NULL,
    "selectedProduct" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedChart_pkey" PRIMARY KEY ("id")
);
