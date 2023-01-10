/*
  Warnings:

  - Added the required column `attributionName` to the `ContractTracking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event` to the `ContractTracking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `ContractTracking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContractTracking" ADD COLUMN     "attributionName" TEXT NOT NULL,
ADD COLUMN     "event" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
