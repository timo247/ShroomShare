import mongoose from 'mongoose';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import speciesSeeder from '../../seeders/speciesSeeder.js';
import mushroomsSeeder from '../../seeders/mushroomSeeder.js';
import msg, { RESSOURCES as R } from '../../data/messages.js';
import ApiTester from '../../helpers/ApiTester.js';
import defineTest from '../../helpers/useDefineTest.js';
import Mushroom from '../../schemas/mushroom.js';

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

// describe('GET /mushrooms', () => {
//   beforeEach(prepare);

//   defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), 'without pictures', async (messageWrapper) => {
//     const res = await ApiTester.apiCall({
//       method: 'get',
//       path: 'mushrooms/?showPictures=true',
//       messageWrapper,
//       token: tester.userToken,
//     });
//     expect(res.body).toEqual(
//       expect.objectContaining({
//         message: expect.stringContaining(messageWrapper.msg),
//         currentPage: expect.any(Number),
//         lastPage: expect.any(Number),
//         pageSize: expect.any(Number),
//         mushrooms: expect.arrayContaining([
//           expect.objectContaining({
//             description: expect.any(String),
//             id: expect.any(String),
//             species_id: expect.any(String),
//             user_id: expect.any(String),
//             date: expect.any(String),
//             picture_id: expect.any(String),
//           }),
//         ]),
//       }),
//     );
//   });

//   defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), 'with pictures', async (messageWrapper) => {
//     const res = await ApiTester.apiCall({
//       method: 'get',
//       path: 'species/?showPictures=true&pageSize=2',
//       messageWrapper,
//       token: tester.userToken,
//     });
//     expect(res.body).toEqual(
//       expect.objectContaining({
//         message: expect.stringContaining(messageWrapper.msg),
//         currentPage: expect.any(Number),
//         lastPage: expect.any(Number),
//         pageSize: expect.any(Number),
//         mushrooms: expect.arrayContaining([
//           expect.objectContaining({
//             id: expect.any(String),
//             description: expect.any(String),
//             picture_id: expect.any(String),
//             user_id: expect.any(String),
//             date: expect.any(String),
//             species_id: expect.any(String),
//             picture: expect.objectContaining({
//               value: expect.any(String),
//               specy_id: expect.any(String),
//               collectionName: expect.any(String),
//               date: expect.any(String),
//               id: expect.any(String),
//             }),
//             geolocalisation: expect.objectContaining({
//               location: expect.objectContaining({
//                 type: expect.stringContaining('Point'),
//               }),
//               coordinates: expect.number(Array),
//             }),
//           }),
//         ]),
//       }),
//     );
//   });

//   defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), 'retrieve specific species id ', async (messageWrapper) => {
//     const validSpecyId = ApiTester.getValidSpecyId();
//     const res = await ApiTester.apiCall({
//       method: 'get',
//       path: `species/pageSize=2&speciesId=${validSpecyId}`,
//       messageWrapper,
//       token: tester.userToken,
//     });
//     expect(res.body).toEqual(
//       expect.objectContaining({
//         message: expect.stringContaining(messageWrapper.msg),
//         currentPage: expect.any(Number),
//         lastPage: expect.any(Number),
//         pageSize: expect.any(Number),
//         mushrooms: expect.arrayContaining([
//           expect.objectContaining({
//             id: expect.any(String),
//             description: expect.any(String),
//             picture_id: expect.any(String),
//             user_id: expect.any(String),
//             date: expect.any(String),
//             species_id: expect.stringContaining(validSpecyId),
//             geolocalisation: expect.objectContaining({
//               location: expect.objectContaining({
//                 type: expect.stringContaining('Point'),
//               }),
//               coordinates: expect.number(Array),
//             }),
//           }),
//         ]),
//       }),
//     );
//   });

//   defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), 'retrieve specific user\'s mushrooms', async (messageWrapper) => {
//     const validUserId = ApiTester.getValidUserId();
//     const res = await ApiTester.apiCall({
//       method: 'get',
//       path: `species/pageSize=2&userId=${validUserId}`,
//       messageWrapper,
//       token: tester.userToken,
//     });
//     expect(res.body).toEqual(
//       expect.objectContaining({
//         message: expect.stringContaining(messageWrapper.msg),
//         currentPage: expect.any(Number),
//         lastPage: expect.any(Number),
//         pageSize: expect.any(Number),
//         mushrooms: expect.arrayContaining([
//           expect.objectContaining({
//             id: expect.any(String),
//             description: expect.any(String),
//             picture_id: expect.any(String),
//             user_id: expect.stringContaining(validUserId),
//             date: expect.any(String),
//             species_id: expect.any(String),
//             geolocalisation: expect.objectContaining({
//               location: expect.objectContaining({
//                 type: expect.stringContaining('Point'),
//               }),
//               coordinates: expect.number(Array),
//             }),
//           }),
//         ]),
//       }),
//     );
//   });

//   defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.MUSHROOMS), 'retrieve a specific usage', async (messageWrapper) => {
//     const res = await ApiTester.apiCall({
//       method: 'get',
//       path: 'species/pageSize=2&usage=commestible',
//       messageWrapper,
//       token: tester.userToken,
//     });
//     expect(res.body).toEqual(
//       expect.objectContaining({
//         message: expect.stringContaining(messageWrapper.msg),
//         currentPage: expect.any(Number),
//         lastPage: expect.any(Number),
//         pageSize: expect.any(Number),
//         mushrooms: expect.arrayContaining([
//           expect.objectContaining({
//             id: expect.any(String),
//             description: expect.any(String),
//             picture_id: expect.any(String),
//             user_id: expect.stringContaining(validUserId),
//             date: expect.any(String),
//             species_id: expect.any(String),
//             geolocalisation: expect.objectContaining({
//               location: expect.objectContaining({
//                 type: expect.stringContaining('Point'),
//               }),
//               coordinates: expect.number(Array),
//             }),
//           }),
//         ]),
//       }),
//     );
//   });
// });

// ==========================================================================
//  POST /mushrooms
// ==========================================================================

describe('POST /mushrooms', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_CREATION(R.MUSHROOM), '', async (messageWrapper) => {
    const picture = ApiTester.createPicture();
    const specyId = ApiTester.getValidSpecyId(tester.userToken);
    const newDate = String(Date.now());
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'mushrooms',
      body: {
        description: '...',
        specy_id: specyId,
        picture,
        date: newDate,
        geolocalisation: {
          location: {
            type: 'Point',
            coordinates: [46.616517, 6.234434],
          },
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
          species_id: expect.stringContaining('1'),
          description: expect.stringContaining('...'),
          user_id: expect.any(String),
          date: expect.stringContaining(newDate),
          id: expect.any(String),
          picture: expect.objectContaining({
            specy_id: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
            collectionName: expect.any(String),
          }),
          geolocalisation: expect.objectContaining({
            location: expect.objectContaining({
              type: expect.stringContaining('Point'),
              coordinates: expect.arrayContaining([
                latitude, longitude,
              ]),
            }),
          }),
        }),
      }),
    );
  });

  defineTest(msg.ERROR_FIELD_REQUIRED('X'), 'missing fields', async (messageWrapper) => {
    const newDate = String(Date.now());
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
          msg.ERROR_FIELD_REQUIRED('geolocalisation').msg,
          msg.ERROR_FIELD_REQUIRED('specy_id').msg,
        ]),
      }),
    );
  });

  defineTest(msg.ERROR_IMG_BASE64, '', async (messageWrapper) => {
    const newDate = String(Date.now());
    const specyId = ApiTester.getValidSpecyId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'mushrooms',
      body: {
        description: '...',
        specy_id: specyId,
        picture: 'adfakfj',
        date: newDate,
        geolocalisation: {
          location: {
            type: 'Point',
            coordinates: [46.616517, 6.234434],
          },
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
    const specyId = ApiTester.getValidSpecyId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'mushrooms',
      body: {
        description: '...',
        specy_id: specyId,
        picture,
        date: 'gg',
        geolocalisation: {
          location: {
            type: 'Point',
            coordinates: [46.616517, 6.234434],
          },
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
    const newDate = String(Date.now());
    const picture = ApiTester.createPicture();
    const specyId = ApiTester.getValidSpecyId(tester.userToken);
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'mushrooms',
      body: {
        description: '...',
        specy_id: specyId,
        picture,
        date: newDate,
        geolocalisation: {
          location: {
            type: 'Point',
            coordinates: [100, 200],
          },
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
        geolocalisation: {
          location: {
            type: 'Point',
            coordinates: [
              longitude,
              latitude,
            ],
          },
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
          date: expect.any(String),
          description: expect.stringContaining(newDescription),
          id: expect.any(String),
          specy_id: expect.any(String),
          user_id: expect.any(String),
          picture_id: expect.any(String),
          picture: expect.objectContaining({
            specy_id: expect.any(String),
            collectionName: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
            user_id: expect.any(String),
            mushroom_id: expect.any(String),
          }),
          geolocalisation: expect.objectContaining({
            location: expect.objectContaining({
              type: expect.stringContaining('Point'),
              coordinates: expect.arrayContaining([
                latitude, longitude,
              ]),
            }),
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
        geolocalisation: {
          location: {
            type: 'Point',
            coordinates: [
              100,
              200,
            ],
          },
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
