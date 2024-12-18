/*
  Warnings:

  - A unique constraint covering the columns `[completedFormId,questionText]` on the table `Response` will be added. If there are existing duplicate values, this will fail.
  - Made the column `questionText` on table `Response` required. This step will fail if there are existing NULL values in that column.
  - Made the column `questionType` on table `Response` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Response_completedFormId_questionId_key";

-- AlterTable
ALTER TABLE "Response" ALTER COLUMN "questionText" SET NOT NULL,
ALTER COLUMN "questionType" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Response_completedFormId_questionText_key" ON "Response"("completedFormId", "questionText");
