/*
  Warnings:

  - You are about to drop the `_PropertyAmenities` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `_PropertyAmenities`;

-- CreateTable
CREATE TABLE `PropertyAmenity` (
    `propertyId` VARCHAR(191) NOT NULL,
    `amenityId` VARCHAR(191) NOT NULL,

    INDEX `PropertyAmenity_amenityId_idx`(`amenityId`),
    PRIMARY KEY (`propertyId`, `amenityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
