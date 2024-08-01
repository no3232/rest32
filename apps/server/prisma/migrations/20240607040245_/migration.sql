/*
  Warnings:

  - Added the required column `owner_id` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ReservationOnUser` DROP FOREIGN KEY `ReservationOnUser_reservation_id_fkey`;

-- AlterTable
ALTER TABLE `Reservation` ADD COLUMN `owner_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Reservation` ADD CONSTRAINT `Reservation_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `User`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReservationOnUser` ADD CONSTRAINT `ReservationOnUser_reservation_id_fkey` FOREIGN KEY (`reservation_id`) REFERENCES `Reservation`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
