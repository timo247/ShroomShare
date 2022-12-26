import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import speciesSeeder from '../../seeders/speciesSeeder.js';
import mushroomsSeeder from '../../seeders/mushroomSeeder.js';
import msg, { RESSOURCES as R } from '../../data/messages.js';
import ApiTester from '../../helpers/ApiTester.js';
import defineTest from '../../helpers/useDefineTest.js';

let tester;
const prepare = async () => {
  await cleanUpDb();
  await usersSeeder();
  await speciesSeeder();
  await mushroomsSeeder();
  tester = new ApiTester();
  await tester.setTokens();
};

// ==========================================================================
//  GET /mushrooms
// ==========================================================================

describe('GET /mushrooms', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), 'without pictures', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'get',
      path: 'mushrooms',
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
            description: expect.any(String),
            date: expect.any(String),
            picture: expect.any(String),
            specy: expect.objectContaining({
              name: expect.any(String),
              description: expect.any(String),
              usage: expect.any(String),
              picture: expect.any(String),
              id: expect.any(String),
            }),
            user: expect.objectContaining({
              username: expect.any(String),
              admin: expect.any(Boolean),
              id: expect.any(String),
            }),
            location: expect.objectContaining({
              type: expect.stringContaining('Point'),
              coordinates: expect.any(Array),
            }),
          }),
        ]),
      }),
    );
  });

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), 'with pictures', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'get',
      path: 'mushrooms/?showPictures=true&pageSize=2',
      messageWrapper,
      token: tester.userToken,
    });
    let i = 0;
    res.body.items.forEach((mushroom) => {
      expect(typeof mushroom.picture.value).toBe('string');
      delete res.body.items[i].picture.value;
      i++;
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
            date: expect.any(String),
            description: expect.any(String),
            specy: expect.objectContaining({
              name: expect.any(String),
              description: expect.any(String),
              usage: expect.any(String),
              picture: expect.any(String),
              id: expect.any(String),
            }),
            user: expect.objectContaining({
              username: expect.any(String),
              admin: expect.any(Boolean),
              id: expect.any(String),
            }),
            picture: expect.objectContaining({
              specy: expect.any(String),
              mushroom: expect.any(String),
              collectionName: expect.any(String),
              date: expect.any(String),
              user: expect.any(String),
            }),
            location: expect.objectContaining({
              type: expect.stringContaining('Point'),
              coordinates: expect.any(Array),
            }),
          }),
        ]),
      }),
    );
  });

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), 'retrieve specific specy id ', async (messageWrapper) => {
    const validSpecyId = await ApiTester.getValidSpecyId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'get',
      path: `mushrooms/?pageSize=2&specyIds=${validSpecyId}`,
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
            description: expect.any(String),
            date: expect.any(String),
            picture: expect.any(String),
            specy: expect.objectContaining({
              name: expect.any(String),
              description: expect.any(String),
              usage: expect.any(String),
              picture: expect.any(String),
              id: expect.stringContaining(validSpecyId),
            }),
            user: expect.objectContaining({
              username: expect.any(String),
              admin: expect.any(Boolean),
              id: expect.any(String),
            }),
            location: expect.objectContaining({
              type: expect.stringContaining('Point'),
              coordinates: expect.any(Array),
            }),
          }),
        ]),
      }),
    );
  });

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), 'retrieve specific user\'s mushrooms', async (messageWrapper) => {
    const validUserId = await ApiTester.getValidUserId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'get',
      path: `mushrooms/?pageSize=2&userId=${validUserId}`,
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
            description: expect.any(String),
            date: expect.any(String),
            picture: expect.any(String),
            specy: expect.objectContaining({
              name: expect.any(String),
              description: expect.any(String),
              usage: expect.any(String),
              picture: expect.any(String),
              id: expect.any(String),
            }),
            user: expect.objectContaining({
              username: expect.any(String),
              admin: expect.any(Boolean),
              id: expect.stringContaining(validUserId),
            }),
            location: expect.objectContaining({
              type: expect.stringContaining('Point'),
              coordinates: expect.any(Array),
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

  defineTest(msg.SUCCESS_RESSOURCE_CREATION(R.MUSHROOM), '', async (messageWrapper) => {
    const picture = ApiTester.createPicture();
    const specyId = await ApiTester.getValidSpecyId(tester.userToken);
    const newDate = Date.now();
    const latitude = 46.616517;
    const longitude = 6.234434;
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'mushrooms',
      body: {
        description: '...',
        specy_id: specyId,
        picture,
        date: newDate,
        location: {
          type: 'Point',
          coordinates: [latitude, longitude],
        },
      },
      messageWrapper,
      token: tester.userToken,
    });
    expect(typeof res.body.mushroom.picture.value).toBe('string');
    delete res.body.mushroom.picture.value;
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        mushroom: expect.objectContaining({
          specy: expect.stringContaining(String(specyId)),
          description: expect.stringContaining('...'),
          user: expect.any(String),
          date: expect.any(String),
          id: expect.any(String),
          picture: expect.objectContaining({
            specy: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
            collectionName: expect.any(String),
          }),
          location: expect.objectContaining({
            type: expect.stringContaining('Point'),
            coordinates: expect.arrayContaining([
              latitude, longitude,
            ]),
          }),
        }),
      }),
    );
  });

  defineTest(msg.ERROR_FIELD_REQUIRED('X'), 'missing fields', async (messageWrapper) => {
    const newDate = Date.now();
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'mushrooms',
      body: {
        description: '...',
        date: newDate,
      },
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        messages: expect.arrayContaining([
          msg.ERROR_FIELD_REQUIRED('picture').msg,
          msg.ERROR_FIELD_REQUIRED('location').msg,
          msg.ERROR_FIELD_REQUIRED('specy_id').msg,
        ]),
      }),
    );
  });

  defineTest(msg.ERROR_IMG_BASE64, '', async (messageWrapper) => {
    const newDate = Date.now();
    const specyId = await ApiTester.getValidSpecyId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'mushrooms',
      body: {
        description: '...',
        specy_id: specyId,
        picture: 'adfakfj',
        date: newDate,
        location: {
          type: 'Point',
          coordinates: [46.616517, 6.234434],
        },
      },
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_DATE_FORMAT, '', async (messageWrapper) => {
    const picture = ApiTester.createPicture();
    const specyId = await ApiTester.getValidSpecyId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'mushrooms',
      body: {
        description: '...',
        specy_id: specyId,
        picture,
        date: 'gg',
        location: {
          type: 'Point',
          coordinates: [46.616517, 6.234434],
        },
      },
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_GEOJSON_FORMAT, '', async (messageWrapper) => {
    const newDate = Date.now();
    const picture = ApiTester.createPicture();
    const specyId = await ApiTester.getValidSpecyId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'mushrooms',
      body: {
        description: '...',
        specy_id: specyId,
        picture,
        date: newDate,
        location: {
          type: 'Point',
          coordinates: [100, 200],
        },
      },
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
//  PATCH /mushrooms/:id
// ==========================================================================

describe('PATCH /mushrooms/:id', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_MODIFICATION(R.MUSHROOM), '', async (messageWrapper) => {
    const validMushroomId = await ApiTester.getValidMushroomId(tester.adminToken);
    const newDescription = '...';
    const newPicture = ApiTester.createPicture();
    const latitude = 46.616517;
    const longitude = 6.213434;
    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `mushrooms/${validMushroomId}`,
      body: {
        description: newDescription,
        picture: newPicture,
        location: {
          type: 'Point',
          coordinates: [
            longitude,
            latitude,
          ],
        },
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
          id: expect.any(String),
          description: expect.any(String),
          date: expect.any(String),
          picture: expect.objectContaining({
            specy: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
            collectionName: expect.any(String),
          }),
          specy: expect.objectContaining({
            name: expect.any(String),
            description: expect.any(String),
            usage: expect.any(String),
            picture: expect.any(String),
            id: expect.any(String),
          }),
          user: expect.objectContaining({
            username: expect.any(String),
            admin: expect.any(Boolean),
            id: expect.any(String),
          }),
          location: expect.objectContaining({
            type: expect.stringContaining('Point'),
            coordinates: expect.arrayContaining([
              latitude, longitude,
            ]),
          }),
        }),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.MUSHROOM), 'invalid mongoose id', async (messageWrapper) => {
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

  defineTest(msg.ERROR_GEOJSON_FORMAT, '', async (messageWrapper) => {
    const validMushroomId = await ApiTester.getValidSpecyId(tester.userToken);

    const res = await ApiTester.apiCall({
      method: 'patch',
      path: `mushrooms/${validMushroomId}`,
      messageWrapper,
      token: tester.userToken,
      body: {
        location: {
          type: 'Point',
          coordinates: [
            100,
            200,
          ],
        },
      },
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
      path: `mushrooms/${validMushroomId}`,
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.MUSHROOM), 'invalid mongoose id', async (messageWrapper) => {
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
