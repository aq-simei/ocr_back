import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { CustomError } from 'src/customError/customError';
import { prisma } from 'src/main';

@Injectable()
export class OpenaiService {
  private openAi: OpenAI;
  constructor() {
    this.openAi = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  async getAllResponses(ocrId: string): Promise<any> {
    return prisma.lLMResponse.findMany({
      where: {
        ocrId: ocrId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async askQuestion(ocrId: string, question: string): Promise<any> {
    let res: OpenAI.Chat.Completions.ChatCompletion;
    const ocr = await prisma.ocrResult.findUnique({
      where: {
        id: ocrId,
      },
    });
    const previousAskedByOcr = await prisma.lLMResponse.findUnique({
      where: {
        question_ocrId: {
          question: question,
          ocrId: ocrId,
        },
      },
    });

    if (previousAskedByOcr) {
      return { message: 'Already Asked', response: previousAskedByOcr };
    }

    if (!ocr) {
      throw new CustomError('OCR', `OCR not found with the id ${ocrId}`);
    }
    try {
      const response = await this.openAi.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              "You are a text analyst. I'll provide text extracted from images and you'll answer questions based on the text.",
          },
          {
            role: 'user',
            content: ocr.text,
          },
          {
            role: 'user',
            content: question,
          },
        ],
      });
      res = response;
    } catch (err) {
      console.log('Error asking question', err);
      throw new CustomError('OPEN AI', err);
    }
    const createdLlmResponse = await prisma.lLMResponse.create({
      data: {
        response: res.choices[0].message.content,
        question: question,
        ocrId: ocrId,
      },
    });
    return createdLlmResponse;
  }
}
