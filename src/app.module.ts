import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FilesService } from './files/files.service';
import { FilesModule } from './files/files.module';
import { OcrController } from './ocr/ocr.controller';
import { OcrModule } from './ocr/ocr.module';
import { OpenaiController } from './openai/openai.controller';
import { OpenaiModule } from './openai/openai.module';

@Module({
  imports: [UserModule, AuthModule, FilesModule, OcrModule, OpenaiModule],
  controllers: [AppController, OcrController, OpenaiController],
  providers: [AppService, FilesService],
})
export class AppModule {}
