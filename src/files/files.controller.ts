import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const userId = req.user.userId;
    return this.filesService.uploadFile(file, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('data/:filename')
  async getData(@Param('filename') filename: string, @Req() req) {
    const userId = req.user.userId;
    return this.filesService.getFileByName(filename, userId);
  }
  @Get('list')
  @UseGuards(JwtAuthGuard)
  async listFiles(@Req() req) {
    const userId = req.user.userId;
    return this.filesService.listFiles(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:filename')
  async deleteFile(@Param('filename') filename: string, @Req() req) {
    const userId = req.user.userId;
    return this.filesService.deleteFile(filename, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Req() req,
    @Res() res,
  ) {
    const userId = req.user.userId;
    const file = await this.filesService.getFilePath(filename, userId);
    res.download(file);
  }
}
