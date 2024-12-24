/*
  Warnings:

  - A unique constraint covering the columns `[question,ocrId]` on the table `LLMResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "LLMResponse_question_key";

-- CreateIndex
CREATE UNIQUE INDEX "LLMResponse_question_ocrId_key" ON "LLMResponse"("question", "ocrId");
