/*
  Warnings:

  - Added the required column `period` to the `CompletedForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompletedForm" ADD COLUMN     "period" TEXT NOT NULL;
