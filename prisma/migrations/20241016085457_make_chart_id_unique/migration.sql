/*
  Warnings:

  - A unique constraint covering the columns `[chartId]` on the table `SharedChart` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SharedChart_chartId_key" ON "SharedChart"("chartId");
