import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryService } from './cloudinary.provider';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({}),      
  ],
  controllers: [UploadController],
  providers: [CloudinaryService],
  exports: [CloudinaryService]
})
export class UploadModule {}
