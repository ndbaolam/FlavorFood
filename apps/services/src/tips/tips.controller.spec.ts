import { Test, TestingModule } from '@nestjs/testing';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';
import { CreateTipDto, UpdateTipDto } from './dto/tips.dto';

const mockTip = {
  tip_id: 1,
  title: 'Test Tip',
  thumbnail: 'test.jpg',
  content: 'Test content',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TipsController', () => {
  let controller: TipsController;
  let service: TipsService;

  const mockTipsService = {
    create: jest.fn().mockResolvedValue(mockTip),
    findAll: jest.fn().mockResolvedValue([mockTip]),
    findOne: jest.fn().mockResolvedValue(mockTip),
    update: jest.fn().mockResolvedValue(mockTip),
    remove: jest.fn().mockResolvedValue(undefined),
    searchByTitle: jest.fn().mockResolvedValue([mockTip]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipsController],
      providers: [
        {
          provide: TipsService,
          useValue: mockTipsService,
        },
      ],
    }).compile();

    controller = module.get<TipsController>(TipsController);
    service = module.get<TipsService>(TipsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a tip', async () => {
    const dto: CreateTipDto = {
      title: 'Test Tip',
      thumbnail: 'test.jpg',
      content: 'Test content',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockTip);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all tips', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockTip]);
  });

  it('should return one tip by ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockTip);
  });

  it('should update a tip', async () => {
    const dto: UpdateTipDto = { title: 'Updated Tip' };
    const result = await controller.update(1, dto);
    expect(result).toEqual(mockTip);
  });

  it('should delete a tip', async () => {
    const result = await controller.remove(1);
    expect(result).toBeUndefined();
  });

  it('should search tips by title', async () => {
    const result = await controller.search('Test');
    expect(result).toEqual([mockTip]);
  });
});
