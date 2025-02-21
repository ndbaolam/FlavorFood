import { Test, TestingModule } from '@nestjs/testing';
import { TipsService } from './tips.service';
import { Tips } from './entity/tips.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

const mockTip = {
  tip_id: 1,
  title: 'Test Tip',
  thumbnail: 'test.jpg',
  content: 'Test content',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TipsService', () => {
  let service: TipsService;
  let repository: Repository<Tips>;

  const mockRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockResolvedValue(mockTip),
    find: jest.fn().mockResolvedValue([mockTip]),
    findOne: jest.fn().mockImplementation(({ where: { tip_id } }) =>
      tip_id === 1 ? Promise.resolve(mockTip) : Promise.resolve(null),
    ),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TipsService,
        {
          provide: getRepositoryToken(Tips),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TipsService>(TipsService);
    repository = module.get<Repository<Tips>>(getRepositoryToken(Tips));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a tip', async () => {
    const result = await service.create({
      title: 'Test Tip',
      thumbnail: 'test.jpg',
      content: 'Test content',
    });
    expect(result).toEqual(mockTip);
    expect(mockRepository.create).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should return all tips', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockTip]);
  });

  it('should find one tip by ID', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockTip);
  });

  it('should throw NotFoundException if tip not found', async () => {
    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a tip', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(mockTip);
    const result = await service.update(1, { title: 'Updated Tip' });
    expect(result).toEqual(mockTip);
  });

  it('should delete a tip', async () => {
    await expect(service.remove(1)).resolves.toBeUndefined();
  });

  it('should throw NotFoundException if deleting non-existing tip', async () => {
    jest.spyOn(mockRepository, 'delete').mockResolvedValue({ affected: 0 });
    await expect(service.remove(999)).rejects.toThrow(NotFoundException);
  });

  it('should search tip by title', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([mockTip]);
    const result = await service.searchByTitle('Test');
    expect(result).toEqual([mockTip]);
  });
});
