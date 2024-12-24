/*
  Warnings:

  - A unique constraint covering the columns `[ocrId]` on the table `LLMResponse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ocrId` to the `LLMResponse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LLMResponse" DROP CONSTRAINT "LLMResponse_fileId_fkey";

-- AlterTable
ALTER TABLE "LLMResponse" ADD COLUMN     "ocrId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LLMResponse_ocrId_key" ON "LLMResponse"("ocrId");

-- AddForeignKey
ALTER TABLE "LLMResponse" ADD CONSTRAINT "LLMResponse_ocrId_fkey" FOREIGN KEY ("ocrId") REFERENCES "OcrResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
