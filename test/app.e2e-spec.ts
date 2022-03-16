import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const A_USER = {
  userName: 'Jubarz',
  firstName: 'Julie',
  lastName: 'Bazhergi',
  avatar: 'blablaavatar',
  email: 'JulieBaz@gmail.com',
  phoneNumber: '4184441919',
  creationDate: '8 janvier',
};

const AN_INVALID_USER = {
  firstName: 'Julie',
  lastName: 'Bazhergi',
  avatar: 'blablaavatar',
  email: 'JulieBaz@gmail.com',
  phoneNumber: '4184441919',
  creationDate: '8 janvier',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let A_POST_RETURN: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('returns code 200 when Add new user', async () => {
    return await request(app.getHttpServer())
      .post('/users')
      .send(A_USER)
      .expect(201)
      .then((result) => {
        A_POST_RETURN = result.body;
      });
  });

  it('returns code 400 when Add user with missing userName ', async () => {
    return await request(app.getHttpServer())
      .post('/users')
      .send(AN_INVALID_USER)
      .expect(400);
  });

  it('returns code 200 when get all users', async () => {
    return await request(app.getHttpServer()).get('/users').expect(200);
  });
});
