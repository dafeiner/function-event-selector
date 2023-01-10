/*
  Warnings:

  - You are about to drop the column `user_address` on the `contract_trackings` table. All the data in the column will be lost.
  - You are about to drop the column `value_transfer` on the `contract_trackings` table. All the data in the column will be lost.
  - Added the required column `user_address_field` to the `contract_trackings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value_transfer_field` to the `contract_trackings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contract_trackings" DROP COLUMN "user_address",
DROP COLUMN "value_transfer",
ADD COLUMN     "user_address_field" TEXT NOT NULL,
ADD COLUMN     "value_transfer_field" DECIMAL(65,30) NOT NULL;
