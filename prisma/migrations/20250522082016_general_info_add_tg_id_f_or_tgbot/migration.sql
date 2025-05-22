/*
  Warnings:

  - Added the required column `tgId` to the `GeneralInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeneralInfo" ADD COLUMN     "tgId" TEXT NOT NULL;
