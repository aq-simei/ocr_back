/*
  Warnings:

  - You are about to drop the column `content` on the `LLMResponse` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[question]` on the table `LLMResponse` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,fileId]` on the table `OcrResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `question` to the `LLMResponse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `response` to the `LLMResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LLMResponse" DROP COLUMN "content",
ADD COLUMN     "question" TEXT NOT NULL,
ADD COLUMN     "response" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LLMResponse_question_key" ON "LLMResponse"("question");

-- CreateIndex
CREATE UNIQUE INDEX "OcrResult_id_fileId_key" ON "OcrResult"("id", "fileId");
