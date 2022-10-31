import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import msg, { RESSOURCES as R } from '../../data/messages.js';
import ApiTester from '../../helpers/ApiTester';
import defineTest from '../../helpers/useDefineTest.js';

let tester;
const prepare = async () => {
  await cleanUpDb();
  await usersSeeder();
  tester = new ApiTester();
  await tester.setTokens();
};

// ==========================================================================
//  GET /users
// ==========================================================================

describe('GET /users', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.USERS), '', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'get',
      path: 'users',
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        currentPage: expect.any(Number),
        lastPage: expect.any(Number),
        pageSize: expect.any(Number),
        users: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            username: expect.any(String),
            admin: expect.any(Boolean),
          }),
        ]),
      }),
    );
  });
});

// ==========================================================================
//  GET /users/:id
// ==========================================================================

describe('GET /users/:id', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.USER), '', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'get',
      path: `users/${validUserId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        user: expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          admin: expect.any(Boolean),
        }),
      }),
    );
  });
});

// ==========================================================================
//  POST /users
// ==========================================================================

describe('POST /users', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_CREATION(R.USER), 'create a regular user', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'users',
      body: {
        username: 'John Doe',
        password: 'mySecretPassword',
        email: 'john.doe@gmail.com',
        admin: false,
      },
      messageWrapper,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        token: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          admin: expect.any(Boolean),
        }),
      }),
    );
  });

  defineTest(msg.SUCCESS_RESSOURCE_CREATION(R.USER), 'forbid non admin to create a user', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'users',
      body: {
        username: 'John Doe',
        password: 'mySecretPassword',
        email: 'john.doe@gmail.com',
        admin: true,
      },
      messageWrapper,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        token: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          admin: expect.any(Boolean),
        }),
      }),
    );
    expect(res.body.user.admin).toEqual(false);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
