-- DropForeignKey
ALTER TABLE "CompletedForm" DROP CONSTRAINT "CompletedForm_formId_fkey";

-- AddForeignKey
ALTER TABLE "CompletedForm" ADD CONSTRAINT "CompletedForm_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;
