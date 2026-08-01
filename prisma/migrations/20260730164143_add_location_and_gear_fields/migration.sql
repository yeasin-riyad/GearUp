/*
  Warnings:

  - You are about to drop the column `image` on the `gear_items` table. All the data in the column will be lost.
  - Added the required column `deposit` to the `gear_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `gear_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gear_items" DROP COLUMN "image",
ADD COLUMN     "deposit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "location" TEXT NOT NULL;
