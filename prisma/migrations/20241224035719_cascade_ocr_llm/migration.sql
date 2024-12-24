-- DropForeignKey
ALTER TABLE "LLMResponse" DROP CONSTRAINT "LLMResponse_ocrId_fkey";

-- AddForeignKey
ALTER TABLE "LLMResponse" ADD CONSTRAINT "LLMResponse_ocrId_fkey" FOREIGN KEY ("ocrId") REFERENCES "OcrResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
