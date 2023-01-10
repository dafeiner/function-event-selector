/*
  Warnings:

  - Added the required column `contractTrackingId` to the `AttributionEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AttributionEvent" ADD COLUMN     "contractTrackingId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AttributionEvent" ADD CONSTRAINT "AttributionEvent_contractTrackingId_fkey" FOREIGN KEY ("contractTrackingId") REFERENCES "ContractTracking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
