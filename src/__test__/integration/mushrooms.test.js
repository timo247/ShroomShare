import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import speciesSeeder from '../../seeders/speciesSeeder.js';
import msg, { RESSOURCES as R } from '../../data/messages.js';
import ApiTester from '../../helpers/ApiTester.js';
import defineTest from '../../helpers/useDefineTest.js';

/*
 * TODO: GET /mushrooms
 * TODO: POST /mushrooms
 * TODO: PATCH /mushrooms/:id
 */

let tester;
const prepare = async () => {
  await cleanUpDb();
  await usersSeeder();
  await speciesSeeder();
  tester = new ApiTester();
  await tester.setTokens();
};

// ==========================================================================
//  GET /mushrooms
// ==========================================================================

describe('GET /mushrooms', () => {
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
        species: expect.arrayContaining([
          expect.objectContaining({
            description: expect.any(String),
            id: expect.any(String),
            name: expect.any(String),
            pictureId: expect.any(String),
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
        species: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String),
            usage: expect.any(String),
            pictureId: expect.any(String),
            picture: expect.objectContaining({
              value: expect.any(String),
              resource_id: expect.any(String),
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
//  POST /mushrooms
// ==========================================================================

describe('POST /mushrooms', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_CREATION(R.SPECY), 'create a regular specy', async (messageWrapper) => {
    const picture = createPicture();
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
          pictureId: expect.any(String),
          id: expect.any(String),
          picture: expect.objectContaining({
            resource_id: expect.any(String),
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
    const picture = createPicture();
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
//  PATCH /mushrooms/:id
// ==========================================================================

describe('PATCH /mushrooms/:id', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_MODIFICATION(R.SPECY), '', async (messageWrapper) => {
    const validMushroomId = await ApiTester.getValidSpecyId(tester.adminToken);
    const newDate = Date.now();
    const newDescription = '...';
    const newPicture = ApiTester.createPicture();
    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `species/${validMushroomId}`,
      body: {
        date: newDate,
        description: newDescription,
        picture: newPicture,
      },
      token: tester.adminToken,
      messageWrapper,
    });
    expect(typeof res.body.mushroom.picture.value).toBe('string');
    delete res.body.mushroom.picture.value;
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        mushroom: expect.objectContaining({
          description: expect.stringContaining(newDesciption),
          id: expect.any(String),
          specy_id: expect.any(String),
          user_id: expect.any(String),
          date: expect.stringContaining(newDate),
          picture: expect.objectContaining({
            resource_id: expect.any(String),
            collectionName: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
          }),
          location: expect.objectContaining({
            // TODO: implement this
          }),
        }),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY), 'invalid mongoose id', async (messageWrapper) => {
    const validMushroomId = await ApiTester.getValidSpecyId(tester.adminToken);
    const unvalidMushroomId = validMushroomId.slice(0, -2);

    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `mushrooms/${unvalidMushroomId}`,
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
    const validMushroomId = await ApiTester.getValidMushroomId(tester.adminToken);
    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `mushrooms/${validMushroomId}`,
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
//  DELETE /mushrooms/:id
// ==========================================================================

describe('DELETE /mushrooms/:id', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_DELETION(R.MUSHROOM), '', async (messageWrapper) => {
    const validMushroomId = await ApiTester.getValidMushroomId(tester.userToken);

    const res = await ApiTester.apiCall({
      method: 'delete',
      path: `species/${validMushroomId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.SPECY), 'invalid mongoose id', async (messageWrapper) => {
    const validMushroomId = await ApiTester.getValidMushroomId(tester.userToken);
    const unvalidMushroomId = validMushroomId.slice(0, -2);

    const res = await ApiTester.apiCall({
      method: 'delete',
      path: `mushrooms/${unvalidMushroomId}`,
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
    const validMushroomId = await ApiTester.getValidMushroomId(tester.userToken);

    const res = await ApiTester.apiCall({
      method: 'delete',
      path: `mushrooms/${validMushroomId}`,
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
