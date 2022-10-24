import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import msg from '../../data/messages.js';
import useAuth from '../../helpers/useAuth.js';
import ApiTester from '../../helpers/ApiTester.js';

let tester;

const prepare = async () => {
  await cleanUpDb();
  await usersSeeder();
  tester = new ApiTester();
  await tester.setTokens();
};

describe('POST /auth', () => {
  beforeEach(prepare);

  test(`${msg.SUCCESS_TOKEN_CREATION.msg} - regular user auth`, async () => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'auth',
      body: ApiTester.userCredentials,
      messageWrapper: msg.SUCCESS_TOKEN_CREATION,
    });
    const payloadWrapper = useAuth.verifyJwtToken(res.body.token);
    expect(payloadWrapper.payload.scope).toMatch('user');
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        message: expect.stringContaining(msg.SUCCESS_TOKEN_CREATION.msg),
      }),
    );
  });

  test(`${msg.SUCCESS_TOKEN_CREATION.msg} - admin auth`, async () => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'auth',
      body: ApiTester.adminCredentials,
      messageWrapper: msg.SUCCESS_TOKEN_CREATION,
    });
    const payloadWrapper = useAuth.verifyJwtToken(res.body.token);
    expect(payloadWrapper.payload.scope).toMatch('admin');
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        message: expect.stringContaining(msg.SUCCESS_TOKEN_CREATION.msg),
      }),
    );
  });

  test(`${msg.ERROR_AUTH_LOGIN.msg} - username don't exist`, async () => {
    const res = await ApiTester.apiCall({
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
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'auth',
      body: { username: 'user01', password: 'password' },
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
