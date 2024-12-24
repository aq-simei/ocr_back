import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { FilesModule } from 'src/files/files.module';
import { OcrController } from './ocr.controller';

@Module({
  imports: [FilesModule],
  providers: [OcrService],
  controllers: [OcrController],
  exports: [OcrService],
})
export class OcrModule {}
