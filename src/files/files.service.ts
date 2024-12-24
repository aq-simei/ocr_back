import { Injectable } from '@nestjs/common';

import { CustomError } from 'src/customError/customError';
import { prisma } from 'src/main';
const path = require('path');
const fs = require('fs');
const promises = fs.promises;
@Injectable()
export class FilesService {
  private readonly uploadPath = './uploads';
  private readonly allowedFileTypes = ['image/png', 'image/jpeg', 'image/gif'];

  async listFiles(userId: string) {
    return prisma.file.findMany({ where: { userId: userId } });
  }

  async uploadFile(file: Express.Multer.File, userId: string) {
    if (!file) {
      throw new Error('File not found');
    }
    if (!this.allowedFileTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }
    const userUploadPath = `${this.uploadPath}/${userId}`;

    if (!fs.existsSync(userUploadPath)) {
      fs.mkdirSync(userUploadPath);
    }

    const filename = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );

    const filePath = `${userUploadPath}/${file.originalname}`;
    await promises.rename(file.path, filePath);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new CustomError('File', 'No user found with the id');
    }
    const createdFile = await prisma.file.create({
      data: {
        name: filename,
        format: file.mimetype.split('/')[1],
        userId: userId,
        url: filePath,
      },
    });
    return { message: 'File uploaded successfully', file: createdFile };
  }
  async deleteFile(filename: string, userId: string): Promise<void> {
    const fileUrl = await this.getFilePath(filename, userId);
    try {
      await promises.unlink(fileUrl);
      await prisma.file.delete({
        where: { name_userId: { name: filename, userId: userId } },
      });
    } catch (err) {
      console.log('Error deleting file', err);
      throw new CustomError('File', 'Error deleting file ' + err.message);
    }
  }

  async getFileByName(filename: string, userId: string) {
    return prisma.file.findUnique({
      where: { name_userId: { name: filename, userId: userId } },
    });
  }

  async getFilePath(filename: string, userId: string): Promise<string> {
    const file = await prisma.file.findUnique({
      where: {
        name_userId: {
          name: filename,
          userId: userId,
        },
      },
    });
    return file.url;
  }
}
