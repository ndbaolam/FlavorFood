import { Test } from "@nestjs/testing";
import { UploadController } from "./upload.controller";
import { CloudinaryService } from "./cloudinary.provider";

describe("UploadController", () => {
  let controller: UploadController;
  let cloudinaryService: CloudinaryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: CloudinaryService,
          useValue: {
            uploadImage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should upload a file", async () => {
    const file = { 
      fieldname: "image", 
      originalname: "test.jpg", 
      encoding: "7bit", 
      mimetype: "image/jpeg", 
      size: 1024, 
      buffer: Buffer.from("image"),
      stream: null,
      destination: "",
      filename: "test.jpg",
      path: ""
    };
    const result = { secure_url: "https://cloudinary.com/image" };

    jest.spyOn(cloudinaryService, "uploadImage").mockResolvedValue(result);

    expect(await controller.uploadFile(file)).toEqual({ url: result["secure_url"] });
  });
})