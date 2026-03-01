/*
  Warnings:

  - Added the required column `email` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resumeLink` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "coverNote" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "resumeLink" TEXT NOT NULL;
