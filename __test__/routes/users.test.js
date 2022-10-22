import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import msg from '../../data/messages.js';
import * as useTest from '../../helpers/useTest.js';

const prepareDb = async () => {
  await cleanUpDb();
  await usersSeeder();
};
// ==========================================================================
//  GET /users
// ==========================================================================
describe('GET /users', () => {
  beforeAll(useTest.setTokens);
  beforeEach(prepareDb);

  test(msg.SUCCES_USERS_RETRIEVAL.msg, async () => {
    const res = await useTest.apiCall({
      method: 'get',
      path: 'users',
      messageWrapper: msg.SUCCES_USERS_RETRIEVAL,
      token: useTest.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(msg.SUCCES_USERS_RETRIEVAL.msg),
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

  // ==========================================================================
  //  GET /users/:id
  // ==========================================================================
  test(msg.SUCCES_USER_RETRIEVAL.msg, async () => {
    const validUserId = await useTest.getValidUserId(useTest.userToken);
    const res = await useTest.apiCall({
      method: 'get',
      path: `users/${validUserId}`,
      messageWrapper: msg.SUCCES_USER_RETRIEVAL,
      token: useTest.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(msg.SUCCES_USER_RETRIEVAL.msg),
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

test(`${msg.SUCCES_USER_CREATION.msg} - create a regular user`, async () => {
  const res = await useTest.apiCall({
    method: 'post',
    path: 'users',
    body: {
      username: 'John Doe',
      password: 'mySecretPassword',
      email: 'john.doe@gmail.com',
      admin: false,
    },
    messageWrapper: msg.SUCCES_USER_CREATION,
  });
  expect(res.body).toEqual(
    expect.objectContaining({
      message: expect.stringContaining(msg.SUCCES_USER_CREATION.msg),
      user: expect.objectContaining({
        id: expect.any(String),
        password: expect.any(String),
        email: expect.any(String),
        username: expect.any(String),
        admin: expect.any(Boolean),
      }),
    }),
  );
});

afterAll(async () => {
  await mongoose.disconnect();
});
