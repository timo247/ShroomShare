import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import msg from '../../data/messages.js';
import * as useTest from '../../helpers/useTest.js';

const prepareDb = async () => {
  await cleanUpDb();
  await usersSeeder();
  await useTest.setTokens();
};

describe('POST /auth', () => {
  beforeEach(prepareDb);

  test(msg.SUCCESS_TOKEN_CREATION.msg, async () => {
    const res = await useTest.apiCall({
      method: 'post',
      path: 'auth',
      body: useTest.userCredentials,
      messageWrapper: msg.SUCCESS_TOKEN_CREATION,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        message: expect.stringContaining(msg.SUCCESS_TOKEN_CREATION.msg),
      }),
    );
  });

  test(`${msg.ERROR_AUTH_LOGIN.msg} - username don't exist`, async () => {
    const res = await useTest.apiCall({
      method: 'post',
      path: 'auth',
      body: { username: 'user', password: 'password' },
      messageWrapper: msg.ERROR_AUTH_LOGIN,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(msg.ERROR_AUTH_LOGIN.msg),
      }),
    );
  });

  test(`${msg.ERROR_AUTH_LOGIN.msg} - unvalid password`, async () => {
    const res = await useTest.apiCall({
      method: 'post',
      path: 'auth',
      body: { username: 'user1', password: 'password' },
      messageWrapper: msg.ERROR_AUTH_LOGIN,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(msg.ERROR_AUTH_LOGIN.msg),
      }),
    );
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
