import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @UseGuards(JwtAuthGuard)
  @Post('extract-text/')
  async extractText(@Body() body: { filename: string }, @Req() req) {
    const userId = req.user.userId;
    return this.ocrService.extractText(body.filename, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('content')
  async getContent(
    @Body() body: { filename: string; ocrId: string },
    @Req() req,
  ) {
    const userId = req.user.userId;
    return this.ocrService.getContent(body, userId);
  }
}
