import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import msg, { RESSOURCES as R } from '../../data/messages.js';
import ApiTester from '../../helpers/ApiTester.js';
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
        items: expect.arrayContaining([
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

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.USER), 'invalid mongoose id', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);
    const unvalidUserId = validUserId.slice(0, -2);

    const res = await ApiTester.apiCall({
      method: 'get',
      path: `users/${unvalidUserId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.USER), 'id is not attributed to an user', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);
    const unvalidUserId = ApiTester.shuffleString(validUserId);

    const res = await ApiTester.apiCall({
      method: 'get',
      path: `users/${unvalidUserId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
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

  defineTest(msg.ERROR_FIELD_REQUIRED('X'), 'missing fields', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'users',
      body: {
        username: 'John Doe',
      },
      messageWrapper,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        messages: expect.arrayContaining([
          msg.ERROR_FIELD_REQUIRED('password').msg,
          msg.ERROR_FIELD_REQUIRED('email').msg,
        ]),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_UNICITY('username'), '', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'users',
      body: {
        username: 'user01',
        password: 'password01',
        email: 'user01@gmail.com',
      },
      messageWrapper,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });
});

// ==========================================================================
//  PATCH /users/:id
// ==========================================================================

describe('PATCH /users/:id', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_MODIFICATION(R.USER), '', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);
    const newUsername = 'Johnny Depp';
    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `users/${validUserId}`,
      body: {
        username: newUsername,
      },
      token: tester.userToken,
      messageWrapper,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        user: expect.objectContaining({
          id: expect.any(String),
          username: expect.stringContaining(newUsername),
          admin: expect.any(Boolean),
        }),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.USER), 'invalid mongoose id', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);
    const unvalidUserId = validUserId.slice(0, -2);

    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `users/${unvalidUserId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_OWNERRIGHT_GRANTATION, '', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);

    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `users/${validUserId}`,
      messageWrapper,
      token: tester.adminToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });
});

// ==========================================================================
//  DELETE /users/:id
// ==========================================================================

describe('DELETE /users/:id', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_DELETION(R.USER), '', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);

    const res = await ApiTester.apiCall({
      method: 'delete',
      path: `users/${validUserId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.USER), 'invalid mongoose id', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);
    const unvalidUserId = validUserId.slice(0, -2);

    const res = await ApiTester.apiCall({
      method: 'delete',
      path: `users/${unvalidUserId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_OWNERRIGHT_GRANTATION, '', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);

    const res = await ApiTester.apiCall({
      method: 'delete',
      path: `users/${validUserId}`,
      messageWrapper,
      token: tester.adminToken,
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
