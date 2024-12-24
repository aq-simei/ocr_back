/*
  Warnings:

  - You are about to drop the column `fileId` on the `LLMResponse` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "LLMResponse_fileId_key";

-- AlterTable
ALTER TABLE "LLMResponse" DROP COLUMN "fileId";
