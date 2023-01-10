/*
  Warnings:

  - You are about to drop the column `contractTrackingId` on the `attribution_events` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `attribution_events` table. All the data in the column will be lost.
  - You are about to drop the column `attributionName` on the `contract_trackings` table. All the data in the column will be lost.
  - You are about to drop the column `contractId` on the `contract_trackings` table. All the data in the column will be lost.
  - Added the required column `contract_tracking_id` to the `attribution_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `attribution_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attribution_name` to the `contract_trackings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contract_id` to the `contract_trackings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attribution_events" DROP CONSTRAINT "attribution_events_contractTrackingId_fkey";

-- DropForeignKey
ALTER TABLE "attribution_events" DROP CONSTRAINT "attribution_events_userId_fkey";

-- DropForeignKey
ALTER TABLE "contract_trackings" DROP CONSTRAINT "contract_trackings_contractId_fkey";

-- AlterTable
ALTER TABLE "attribution_events" DROP COLUMN "contractTrackingId",
DROP COLUMN "userId",
ADD COLUMN     "contract_tracking_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "contract_trackings" DROP COLUMN "attributionName",
DROP COLUMN "contractId",
ADD COLUMN     "attribution_name" TEXT NOT NULL,
ADD COLUMN     "contract_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "contract_trackings" ADD CONSTRAINT "contract_trackings_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_events" ADD CONSTRAINT "attribution_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_events" ADD CONSTRAINT "attribution_events_contract_tracking_id_fkey" FOREIGN KEY ("contract_tracking_id") REFERENCES "contract_trackings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
