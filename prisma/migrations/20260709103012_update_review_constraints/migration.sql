/*
  Warnings:

  - A unique constraint covering the columns `[customerId,rentalOrderId,gearItemId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Review_rentalOrderId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Review_customerId_rentalOrderId_gearItemId_key" ON "Review"("customerId", "rentalOrderId", "gearItemId");
