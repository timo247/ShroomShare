import supertest from 'supertest';
import mongoose from 'mongoose';
import config from '../../config.js';
import app from '../../app';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';

const prepareDb = async () => {
  await cleanUpDb();
  await usersSeeder();
};

let userToken = '';
let adminToken = '';

const setTokens = async () => {
  const res1 = await supertest(app)
    .post(`/${config.apiName}/auth`)
    .send(userCredentials);
  userToken = res1.body.token;
  if (!userToken) throw new Error('Can\'t set user\'s token');
  const res2 = await supertest(app)
    .post(`/${config.apiName}/auth`)
    .send(adminCredentials);
  adminToken = res2.body.token;
  if (!adminToken) throw new Error('Can\'t set admin\'s token');
};

const adminCredentials = {
  username: 'user2',
  password: 'password2',
};
const userCredentials = {
  username: 'user1',
  password: 'password1',
};

describe('POST /auth', () => {
  beforeAll(setTokens);
  beforeEach(prepareDb);
  it('should create a token', async () => {
    const res = await supertest(app)
      .post(`/${config.apiName}/auth`)
      .send(userCredentials)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        message: expect.any(String),
      }),
    );
  });

  it('should return Ingition!', async () => {
    const res = await supertest(app)
      .get(`/${config.apiName}`)
      .expect(200)
      .expect('Content-Type', /json/);
    expect(res.body.message).toEqual('Ingition!');
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
