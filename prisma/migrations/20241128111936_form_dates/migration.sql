/*
  Warnings:

  - Added the required column `endDate` to the `CompletedForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `CompletedForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CompletedForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompletedForm" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
