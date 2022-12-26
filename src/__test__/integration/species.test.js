import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import speciesSeeder from '../../seeders/speciesSeeder.js';
import msg, { RESSOURCES as R } from '../../data/messages.js';
import ApiTester from '../../helpers/ApiTester.js';
import defineTest from '../../helpers/useDefineTest.js';

let tester;
const prepare = async () => {
  await cleanUpDb();
  await usersSeeder();
  await speciesSeeder();
  tester = new ApiTester();
  await tester.setTokens();
};

// ==========================================================================
//  GET /species
// ==========================================================================

describe('GET /species', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.SPECIES), 'without pictures', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'get',
      path: 'species',
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
            description: expect.any(String),
            id: expect.any(String),
            name: expect.any(String),
            picture: expect.any(String),
            usage: expect.any(String),
          }),
        ]),
      }),
    );
  });

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.SPECIES), 'with pictures', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'get',
      path: 'species/?showPictures=true&pageSize=2',
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
            name: expect.any(String),
            description: expect.any(String),
            usage: expect.any(String),
            picture: expect.objectContaining({
              value: expect.any(String),
              specy: expect.any(String),
              collectionName: expect.any(String),
              date: expect.any(String),
              id: expect.any(String),
            }),
          }),
        ]),
      }),
    );
  });
});

// ==========================================================================
//  GET /species/:id
// ==========================================================================

describe('GET /species/:id', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.SPECY), '', async (messageWrapper) => {
    const validSpecyId = await ApiTester.getValidSpecyId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'get',
      path: `species/${validSpecyId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(typeof res.body.specy.picture.value).toBe('string');
    delete res.body.specy.picture.value;
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        specy: expect.objectContaining({
          description: expect.any(String),
          id: expect.any(String),
          name: expect.any(String),
          usage: expect.any(String),
          picture: expect.objectContaining({
            specy: expect.any(String),
            collectionName: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
          }),
        }),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY), 'invalid mongoose id', async (messageWrapper) => {
    const validSpecyId = await ApiTester.getValidSpecyId(tester.userToken);
    const unvalidSpecyId = validSpecyId.slice(0, -2);

    const res = await ApiTester.apiCall({
      method: 'get',
      path: `species/${unvalidSpecyId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY), 'id is not attributed to a specy', async (messageWrapper) => {
    const validSpecyId = await ApiTester.getValidSpecyId(tester.userToken);
    const unvalidSpecyId = ApiTester.shuffleString(validSpecyId);

    const res = await ApiTester.apiCall({
      method: 'get',
      path: `species/${unvalidSpecyId}`,
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
//  POST /species
// ==========================================================================

describe('POST /species', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_CREATION(R.SPECY), 'create a regular specy', async (messageWrapper) => {
    const picture = ApiTester.createPicture();
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'species',
      body: {
        name: 'Bollet de test',
        description: '...',
        usage: 'commestible',
        picture,
      },
      messageWrapper,
      token: tester.adminToken,
    });
    expect(typeof res.body.specy.picture.value).toBe('string');
    delete res.body.specy.picture.value;
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        specy: expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          usage: expect.any(String),
          id: expect.any(String),
          picture: expect.objectContaining({
            specy: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
          }),
        }),
      }),
    );
  });

  defineTest(msg.ERROR_FIELD_REQUIRED('X'), 'missing fields', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'species',
      body: {
        name: 'Bollet',
        description: '...',
      },
      messageWrapper,
      token: tester.adminToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        messages: expect.arrayContaining([
          msg.ERROR_FIELD_REQUIRED('picture').msg,
          msg.ERROR_FIELD_REQUIRED('usage').msg,
        ]),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_UNICITY('name'), '', async (messageWrapper) => {
    const picture = ApiTester.createPicture();
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'species',
      body: {
        name: 'Morille',
        description: '...',
        usage: 'commestible',
        picture,
      },
      messageWrapper,
      token: tester.adminToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_IMG_BASE64, '', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'species',
      body: {
        name: 'Bollet de test',
        description: '...',
        usage: 'commestible',
        picture: 'dafkjjafljfaj',
      },
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
//  PATCH /species/:id
// ==========================================================================

describe('PATCH /species/:id', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_MODIFICATION(R.SPECY), '', async (messageWrapper) => {
    const validSpecyId = await ApiTester.getValidSpecyId(tester.adminToken);
    const newName = 'Morille';
    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `species/${validSpecyId}`,
      body: {
        name: newName,
      },
      token: tester.adminToken,
      messageWrapper,
    });
    expect(typeof res.body.specy.picture.value).toBe('string');
    delete res.body.specy.picture.value;
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        specy: expect.objectContaining({
          description: expect.any(String),
          id: expect.any(String),
          name: expect.any(String),
          usage: expect.any(String),
          picture: expect.objectContaining({
            specy: expect.any(String),
            collectionName: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
          }),
        }),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY), 'invalid mongoose id', async (messageWrapper) => {
    const validSpecyId = await ApiTester.getValidSpecyId(tester.adminToken);
    const unvalidSpecyId = validSpecyId.slice(0, -2);

    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `species/${unvalidSpecyId}`,
      messageWrapper,
      token: tester.adminToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_IMG_BASE64, '', async (messageWrapper) => {
    const validSpecyId = await ApiTester.getValidSpecyId(tester.adminToken);
    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `species/${validSpecyId}`,
      body: {
        name: 'Bollet de test',
        picture: 'dafkjjafljfaj',
      },
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

describe('DELETE /species/:id', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_DELETION(R.SPECY), '', async (messageWrapper) => {
    const validSpecyId = await ApiTester.getValidSpecyId(tester.adminToken);

    const res = await ApiTester.apiCall({
      method: 'delete',
      path: `species/${validSpecyId}`,
      messageWrapper,
      token: tester.adminToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY), 'invalid mongoose id', async (messageWrapper) => {
    const validSpecyId = await ApiTester.getValidUserId(tester.adminToken);
    const unvalidSpecyId = validSpecyId.slice(0, -2);

    const res = await ApiTester.apiCall({
      method: 'delete',
      path: `species/${unvalidSpecyId}`,
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
