import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Ocr } from 'src/@types/Ocr';
import { CustomError } from 'src/customError/customError';
import { FilesService } from 'src/files/files.service';
import { prisma } from 'src/main';
import { createWorker } from 'tesseract.js';

@Injectable()
export class OcrService {
  constructor(private readonly filesService: FilesService) {}
  async extractText(filename: string, userId: string): Promise<string> {
    const worker = await createWorker('eng');
    const file = await this.filesService.getFileByName(filename, userId);
    if (!file) {
      throw new Error('File not found');
    }
    if (file.userId !== userId) {
      throw new CustomError('OCR', 'Attempt to convert other user file', 403);
    }
    console.log('Extracting text from file', file.url);
    const extractedText = await worker.recognize(file.url);
    await worker.terminate();
    const createdOcr = await prisma.ocrResult.create({
      data: {
        text: extractedText.data.text,
        fileId: file.id,
      },
    });
    await prisma.file.update({
      where: {
        id: file.id,
      },
      data: {
        ocrResultId: createdOcr.id,
      },
    });
    return extractedText.data.text;
  }

  async getContent(
    body: { filename: string; ocrId: string },
    userId: string,
  ): Promise<Ocr> {
    console.log('Getting content from ocr');
    console.log(body);
    const file = await this.filesService.getFileByName(body.filename, userId);
    if (!file) {
      throw new Error('File not found');
    }
    const ocr = await prisma.ocrResult.findUnique({
      where: {
        id_fileId: {
          id: body.ocrId,
          fileId: file.id,
        },
      },
    });
    if (!ocr) {
      throw new Error('ocr not found');
    }
    return ocr;
  }
}
