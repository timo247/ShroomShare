import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import msg from '../../data/messages.js';
import useAuth from '../../helpers/useAuth.js';
import ApiTester from '../../helpers/ApiTester.js';
import defineTest from '../../helpers/useDefineTest.js';

let tester;

const prepare = async () => {
  await cleanUpDb();
  await usersSeeder();
  tester = new ApiTester();
  await tester.setTokens();
};

describe('POST /auth', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_TOKEN_CREATION, 'regular user auth', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'auth',
      body: ApiTester.userCredentials,
      messageWrapper,
    });
    const payloadWrapper = useAuth.verifyJwtToken(res.body.token);
    expect(payloadWrapper.payload.scope).toMatch('user');
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.SUCCESS_TOKEN_CREATION, 'admin auth', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'auth',
      body: ApiTester.adminCredentials,
      messageWrapper,
    });
    const payloadWrapper = useAuth.verifyJwtToken(res.body.token);
    expect(payloadWrapper.payload.scope).toMatch('admin');
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_AUTH_LOGIN, 'username don\'t exist', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'auth',
      body: { username: 'user', password: 'password' },
      messageWrapper,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_AUTH_LOGIN, 'unvalid password', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'auth',
      body: { username: 'user01', password: 'password' },
      messageWrapper,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
