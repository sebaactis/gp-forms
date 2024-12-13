-- CreateEnum
CREATE TYPE "Role" AS ENUM ('RRHH', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
