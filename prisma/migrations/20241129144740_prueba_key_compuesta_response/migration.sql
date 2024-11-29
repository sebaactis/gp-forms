/*
  Warnings:

  - A unique constraint covering the columns `[completedFormId,questionId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Response_completedFormId_questionId_key" ON "Response"("completedFormId", "questionId");
