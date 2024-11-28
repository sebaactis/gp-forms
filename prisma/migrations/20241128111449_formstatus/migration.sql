-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADO');

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_formId_fkey";

-- AlterTable
ALTER TABLE "CompletedForm" ADD COLUMN     "status" "FormStatus" NOT NULL DEFAULT 'PENDIENTE',
ALTER COLUMN "completedAt" DROP NOT NULL,
ALTER COLUMN "completedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "formId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;
