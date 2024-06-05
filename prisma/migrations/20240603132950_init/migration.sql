/*
  Warnings:

  - You are about to alter the column `pricePerNight` on the `Property` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Property` MODIFY `pricePerNight` DOUBLE NOT NULL;
