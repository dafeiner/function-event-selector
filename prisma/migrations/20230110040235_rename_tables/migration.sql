/*
  Warnings:

  - You are about to drop the `AttributionEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Contract` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContractTracking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttributionEvent" DROP CONSTRAINT "AttributionEvent_contractTrackingId_fkey";

-- DropForeignKey
ALTER TABLE "AttributionEvent" DROP CONSTRAINT "AttributionEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContractTracking" DROP CONSTRAINT "ContractTracking_contractId_fkey";

-- DropTable
DROP TABLE "AttributionEvent";

-- DropTable
DROP TABLE "Contract";

-- DropTable
DROP TABLE "ContractTracking";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "contracts" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_trackings" (
    "id" SERIAL NOT NULL,
    "event" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "attributionName" TEXT NOT NULL,
    "user_address" TEXT NOT NULL,
    "value_transfer" DECIMAL(65,30) NOT NULL,
    "fields" TEXT[],
    "contractId" INTEGER NOT NULL,

    CONSTRAINT "contract_trackings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribution_events" (
    "id" SERIAL NOT NULL,
    "contractTrackingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "attribution_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contracts_address_key" ON "contracts"("address");

-- CreateIndex
CREATE UNIQUE INDEX "users_address_key" ON "users"("address");

-- AddForeignKey
ALTER TABLE "contract_trackings" ADD CONSTRAINT "contract_trackings_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_events" ADD CONSTRAINT "attribution_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribution_events" ADD CONSTRAINT "attribution_events_contractTrackingId_fkey" FOREIGN KEY ("contractTrackingId") REFERENCES "contract_trackings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
