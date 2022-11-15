import mongoose from 'mongoose';
import supertest from 'supertest';
import cleanUpDb from '../../helpers/useCleanUpDb.js';
import usersSeeder from '../../seeders/usersSeeder.js';
import config from '../../../config.js';
import msg, { RESSOURCES as R } from '../../data/messages.js';
import ApiTester from '../../helpers/ApiTester.js';
import defineTest from '../../helpers/useDefineTest.js';
import app from '../../../app.js';
import speciesSeeder from '../../seeders/speciesSeeder.js';

let tester;

const prepare = async () => {
  await cleanUpDb();
  await usersSeeder();
  await speciesSeeder();
  tester = new ApiTester();
  await tester.setTokens();
};

describe('POST /pictures', () => {
  beforeEach(prepare);

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.PICTURES), '', async (messageWrapper) => {
    const response = await supertest(app).get(`/${config.apiName}/species`)
      .set('Authorization', `Bearer ${tester.userToken}`);
    const pictureIds = response.body.species.map((specy) => specy.pictureId);
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'pictures',
      body: { ids: pictureIds },
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        pictures: expect.arrayContaining([
          expect.objectContaining({
            value: expect.any(String),
            specy_id: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
            collectionName: expect.any(String),
          }),
        ]),
      }),
    );
  });

  defineTest(msg.ERROR_FIELD_REQUIRED('ids'), '', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'pictures',
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.stringContaining(messageWrapper.msg),
        ]),
      }),
    );
  });

  defineTest(msg.ERROR_EMPTY_ARRAY('ids'), '', async (messageWrapper) => {
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'pictures',
      body: { ids: [] },
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.ERROR_RESSOURCE_EXISTANCE(R.PICTURES), '', async (messageWrapper) => {
    const response = await supertest(app).get(`/${config.apiName}/species`)
      .set('Authorization', `Bearer ${tester.userToken}`);
    const pictureIds = response.body.species.map((specy) => specy.pictureId);
    const unvalidId = ApiTester.shuffleString(pictureIds[0]);
    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'pictures',
      body: { ids: [unvalidId] },
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
      }),
    );
  });

  defineTest(msg.SUCCESS_RESSOURCE_RETRIEVAL(R.PICTURES), 'unvalidIds + unknownIds', async (messageWrapper) => {
    const response = await supertest(app).get(`/${config.apiName}/species`)
      .set('Authorization', `Bearer ${tester.userToken}`);
    const pictureIds = response.body.species.map((specy) => specy.pictureId);
    pictureIds[0] = pictureIds[0].slice(0, -2);
    pictureIds[1] = ApiTester.shuffleString(pictureIds[1]);

    const res = await ApiTester.apiCall({
      method: 'post',
      path: 'pictures',
      body: { ids: pictureIds },
      messageWrapper,
      token: tester.userToken,
    });
    expect(res.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining(messageWrapper.msg),
        warnings: expect.arrayContaining([
          msg.ERROR_PICTURE_ID(pictureIds[0]),
          msg.ERROR_PICTURE_EXISTENCE(pictureIds[1]),
        ]),
        pictures: expect.arrayContaining([
          expect.objectContaining({
            value: expect.any(String),
            specy_id: expect.any(String),
            date: expect.any(String),
            id: expect.any(String),
            collectionName: expect.any(String),
          }),
        ]),
      }),
    );
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
