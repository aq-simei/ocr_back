/*
  Warnings:

  - You are about to drop the column `originalName` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `format` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_originalName_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "originalName",
ADD COLUMN     "format" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_name_key" ON "File"("name");
