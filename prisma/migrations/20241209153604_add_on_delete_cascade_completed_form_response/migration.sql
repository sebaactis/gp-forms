-- DropForeignKey
ALTER TABLE "CompletedForm" DROP CONSTRAINT "CompletedForm_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_completedFormId_fkey";

-- AddForeignKey
ALTER TABLE "CompletedForm" ADD CONSTRAINT "CompletedForm_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_completedFormId_fkey" FOREIGN KEY ("completedFormId") REFERENCES "CompletedForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
