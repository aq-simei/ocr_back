import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}
  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(
    @Body() body: { ocrId: string; question: string },
  ): Promise<void> {
    const { ocrId, question } = body;
    return this.openaiService.askQuestion(ocrId, question);
  }

  @UseGuards(JwtAuthGuard)
  @Post('responses')
  async responses(@Body() body: { ocrId: string }): Promise<void> {
    const { ocrId } = body;
    return this.openaiService.getAllResponses(ocrId);
  }
}
