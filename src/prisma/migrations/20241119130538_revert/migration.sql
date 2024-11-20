/*
  Warnings:

  - Changed the type of `daysLeft` on the `Gigs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Gigs" DROP COLUMN "daysLeft",
ADD COLUMN     "daysLeft" INTEGER NOT NULL;
