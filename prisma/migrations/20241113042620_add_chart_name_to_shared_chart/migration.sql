/*
  Warnings:

  - Added the required column `chartName` to the `SharedChart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SharedChart" ADD COLUMN     "chartName" TEXT NOT NULL;
