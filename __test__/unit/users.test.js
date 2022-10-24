import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import msg from '../../data/messages.js';
import ApiTester from '../../helpers/ApiTester';

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

  test(msg.SUCCESS_USERS_RETRIEVAL.msg, async () => {
    const res = await ApiTester.apiCall({
      method: 'get',
      path: 'users',
      messageWrapper: msg.SUCCESS_USERS_RETRIEVAL,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(msg.SUCCESS_USERS_RETRIEVAL.msg),
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

  test(msg.SUCCESS_USER_RETRIEVAL.msg, async () => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'get',
      path: `users/${validUserId}`,
      messageWrapper: msg.SUCCESS_USER_RETRIEVAL,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(msg.SUCCESS_USER_RETRIEVAL.msg),
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

  test(`${msg.SUCCESS_USER_CREATION.msg} - create a regular user`, async () => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'users',
      body: {
        username: 'John Doe',
        password: 'mySecretPassword',
        email: 'john.doe@gmail.com',
        admin: false,
      },
      messageWrapper: msg.SUCCESS_USER_CREATION,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(msg.SUCCESS_USER_CREATION.msg),
        token: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          admin: expect.any(Boolean),
        }),
      }),
    );
  });

  test(`${msg.SUCCESS_USER_CREATION.msg} - forbid non admin to create a user`, async () => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'users',
      body: {
        username: 'John Doe',
        password: 'mySecretPassword',
        email: 'john.doe@gmail.com',
        admin: true,
      },
      messageWrapper: msg.SUCCESS_USER_CREATION,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(msg.SUCCESS_USER_CREATION.msg),
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
