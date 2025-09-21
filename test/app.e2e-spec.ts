import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('/auth/login (POST) - should return token with valid credentials', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'tester@test.com', password: 'test@2025#' })
      .expect(201);

    expect(res.body.access_token).toBeDefined();
  });

  it('/auth/login (POST) - should fail with invalid credentials', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'wrong@test.com', password: 'wrong' })
      .expect(401);
  });

  it('/packing/secure (GET) - should allow access with valid token', async () => {
    // Primeiro faz login
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'tester@test.com', password: 'test@2025#' })
      .expect(201);

    const token = login.body.access_token;

    const res = await request(app.getHttpServer())
      .get('/packing/secure')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual({
      message: 'Você acessou uma rota protegida com sucesso!',
    });
  });

  it('/packing/secure (GET) - should deny access without token', () => {
    return request(app.getHttpServer()).get('/packing/secure').expect(401);
  });
});
