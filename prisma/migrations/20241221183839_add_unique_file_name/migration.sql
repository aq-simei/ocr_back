/*
  Warnings:

  - A unique constraint covering the columns `[originalName]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_originalName_key" ON "File"("originalName");
