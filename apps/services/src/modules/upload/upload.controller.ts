import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import { CloudinaryService } from "./cloudinary.provider";

@Controller("upload")
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      storage: multer.memoryStorage(),
    })
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.cloudinaryService.uploadImage(file);    
    return { url: result['secure_url'] };
  }
}
