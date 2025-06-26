import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('RecipesModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /recipes should return 200', () => {
    return request(app.getHttpServer()).get('/recipes').expect(200);
  });

  it('POST /recipes should fail without auth', () => {
    return request(app.getHttpServer())
      .post('/recipes')
      .send({ title: 'Test', description: 'Test desc' })
      .expect(401);
  });
});
