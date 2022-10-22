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

// ==========================================================================
//  GET /users
// ==========================================================================

describe('GET /users', () => {
  beforeEach(prepareDb);

  test(msg.SUCCESS_USERS_RETRIEVAL.msg, async () => {
    const res = await useTest.apiCall({
      method: 'get',
      path: 'users',
      messageWrapper: msg.SUCCESS_USERS_RETRIEVAL,
      token: useTest.userToken,
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
  beforeEach(prepareDb);

  test(msg.SUCCESS_USER_RETRIEVAL.msg, async () => {
    const validUserId = await useTest.getValidUserId(useTest.userToken);
    const res = await useTest.apiCall({
      method: 'get',
      path: `users/${validUserId}`,
      messageWrapper: msg.SUCCESS_USER_RETRIEVAL,
      token: useTest.userToken,
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
  beforeEach(prepareDb);

  test(`${msg.SUCCESS_USER_CREATION.msg} - create a regular user`, async () => {
    const res = await useTest.apiCall({
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
    const res = await useTest.apiCall({
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
