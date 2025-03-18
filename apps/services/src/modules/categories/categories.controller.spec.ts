import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoriesDto, UpdateCategoriesDto } from './dto/categories.dto';
import { Categories } from './entity/categories.entity';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a category', async () => {
    const dto: CreateCategoriesDto = { title: 'Tech' };
    const category: Categories = {
      category_id: 1, title: 'Tech', 
      created_at: new Date(), 
      updated_at: new Date(),
      recipes: []
    };
    
    jest.spyOn(service, 'create').mockResolvedValue(category);

    expect(await controller.create(dto)).toBe(category);
  });

  it('should return all categories', async () => {
    const categories: Categories[] = [{
      category_id: 1, title: 'Tech',
      created_at: undefined,
      updated_at: undefined,
      recipes: []
    }];
    
    jest.spyOn(service, 'findAll').mockResolvedValue(categories);

    expect(await controller.findAll()).toBe(categories);
  });

  it('should return a single category', async () => {
    const category: Categories = {
      category_id: 1, title: 'Tech',
      created_at: undefined,
      updated_at: undefined,
      recipes: []
    };
    
    jest.spyOn(service, 'findOne').mockResolvedValue(category);

    expect(await controller.findOne('1')).toBe(category);
  });

  it('should update a category', async () => {
    const dto: UpdateCategoriesDto = { title: 'Updated Tech' };
    const updatedCategory: Categories = {
      category_id: 1, title: 'Updated Tech',
      created_at: undefined,
      updated_at: undefined,
      recipes: []
    };
    
    jest.spyOn(service, 'update').mockResolvedValue(updatedCategory);

    expect(await controller.update('1', dto)).toBe(updatedCategory);
  });

  it('should delete a category', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(undefined);

    expect(await controller.remove('1')).toBeUndefined();
  });
});
