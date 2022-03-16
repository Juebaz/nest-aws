import {
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
  UploadedFile,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomExceptionFilter } from 'src/commons/exceptions-filters/custom-exception.filter';
import { FileService } from './file.service';

@Controller('upload')
@UseFilters(new CustomExceptionFilter())
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.fileService.upload(file);
  }
}
