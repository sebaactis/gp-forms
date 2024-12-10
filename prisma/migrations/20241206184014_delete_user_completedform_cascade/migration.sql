-- DropForeignKey
ALTER TABLE "CompletedForm" DROP CONSTRAINT "CompletedForm_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "CompletedForm" ADD CONSTRAINT "CompletedForm_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
