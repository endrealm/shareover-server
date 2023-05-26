/*
  Warnings:

  - Added the required column `units` to the `Offer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "units" INTEGER NOT NULL;
