import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import speciesSeeder from '../../seeders/speciesSeeder.js';
import msg, { RESSOURCES as R } from '../../data/messages.js';
import ApiTester from '../../helpers/ApiTester';
import defineTest from '../../helpers/useDefineTest.js';
import tobase64 from '../../helpers/imgBase64';

let tester;
const prepare = async () => {
  await cleanUpDb();
  await usersSeeder();
  await speciesSeeder();
  tester = new ApiTester();
  await tester.setTokens();
};

function shuffleString(string) {
  const a = string.split('');
  const n = a.length;

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join('');
}

function createPicture() {
  const imgsPath = path.resolve('src/data/images');
  const imgs = fs.readdirSync(imgsPath);
  const extension = imgs[0].split('.')[1];
  const imgBase64 = tobase64(`src/data/images/${imgs[0]}`, extension);
  return imgBase64;
}

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
      path: 'species/?showPictures=true',
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
          pictureId: expect.any(String),
          usage: expect.any(String),
          picture: expect.objectContaining({
            resource_id: expect.any(String),
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
    const unvalidSpecyId = shuffleString(validSpecyId);

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
    const picture = createPicture();
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'species',
      body: {
        name: 'Bollet',
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
          description: expect.any(String),
          id: expect.any(String),
          name: expect.any(String),
          pictureId: expect.any(String),
          usage: expect.any(String),
          picture: expect.objectContaining({
            resource_id: expect.any(String),
            collectionName: expect.any(String),
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

  // defineTest(msg.ERROR_USER_UNICITY('username'), '', async (messageWrapper) => {
  //   const res = await ApiTester.apiCall({
  //     method: 'post',
  //     path: 'users',
  //     body: {
  //       username: 'user01',
  //       password: 'password01',
  //       email: 'user01@gmail.com',
  //     },
  //     messageWrapper,
  //   });
  //   expect(res.body).toEqual(
  //     expect.objectContaining({
  //       message: expect.stringContaining(messageWrapper.msg),
  //     }),
  //   );
  // });
});

// // ==========================================================================
// //  PATCH /species/:id
// // ==========================================================================

// describe('PATCH /users/:id', () => {
//   beforeEach(prepare);

//   defineTest(msg.SUCCESS_RESSOURCE_MODIFICATION(R.USER), '', async (messageWrapper) => {
//     const validUserId = await ApiTester.getValidUserId(tester.userToken);
//     const newUsername = 'Johnny Depp';
//     const res = await ApiTester.apiCall({
//       method: 'patch',
//       path: `users/${validUserId}`,
//       body: {
//         username: newUsername,
//       },
//       token: tester.userToken,
//       messageWrapper,
//     });
//     expect(res.body).toEqual(
//       expect.objectContaining({
//         message: expect.stringContaining(messageWrapper.msg),
//         user: expect.objectContaining({
//           id: expect.any(String),
//           username: expect.stringContaining(newUsername),
//           admin: expect.any(Boolean),
//         }),
//       }),
//     );
//   });

//   defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.USER), 'invalid mongoose id', async (messageWrapper) => {
//     const validUserId = await ApiTester.getValidUserId(tester.userToken);
//     const unvalidUserId = validUserId.slice(0, -2);

//     const res = await ApiTester.apiCall({
//       method: 'patch',
//       path: `users/${unvalidUserId}`,
//       messageWrapper,
//       token: tester.userToken,
//     });
//     expect(res.body).toEqual(
//       expect.objectContaining({
//         message: expect.stringContaining(messageWrapper.msg),
//       }),
//     );
//   });

//   defineTest(msg.ERROR_OWNERRIGHT_GRANTATION, '', async (messageWrapper) => {
//     const validUserId = await ApiTester.getValidUserId(tester.userToken);

//     const res = await ApiTester.apiCall({
//       method: 'patch',
//       path: `users/${validUserId}`,
//       messageWrapper,
//       token: tester.adminToken,
//     });
//     expect(res.body).toEqual(
//       expect.objectContaining({
//         message: expect.stringContaining(messageWrapper.msg),
//       }),
//     );
//   });
// });

// // ==========================================================================
// //  DELETE /users/:id
// // ==========================================================================

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
