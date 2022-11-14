import path from 'path';
import fs from 'fs';
import supertest from 'supertest';
import app from '../../app.js';
import config from '../../config.js';
import tobase64 from './useToBase64.js';

export default class ApiTester {
  userToken = '';

  adminToken = '';

  static adminCredentials = {
    username: 'user02',
    password: 'password02',
  };

  static userCredentials = {
    username: 'user01',
    password: 'password01',
  };

  async setTokens() {
    const res1 = await supertest(app)
      .post(`/${config.apiName}/auth`)
      .send(ApiTester.userCredentials);
    this.userToken = res1.body.token;
    if (!this.userToken) throw new Error('Can\'t set user\'s token');
    const res2 = await supertest(app)
      .post(`/${config.apiName}/auth`)
      .send(ApiTester.adminCredentials);
    this.adminToken = res2.body.token;
    if (!this.adminToken) throw new Error('Can\'t set admin\'s token');
  }

  static async apiCall({ method, path, body, messageWrapper, token } = {}) { // eslint-disable-line
    const response = await supertest(app)[method.toLowerCase()](`/${config.apiName}/${path}`)
      .send(body)
      .set('Authorization', `Bearer ${token}`)
      .expect(messageWrapper.status)
      .expect('Content-Type', /json/);
    return response;
  }

  static async getValidUserId(token) {
    const response = await supertest(app).get(`/${config.apiName}/users`)
      .set('Authorization', `Bearer ${token}`);
    const id = response.body.users.find((el) => el.username === 'user01').id;
    return id;
  }

  static async getValidSpecyId(token) {
    const response = await supertest(app).get(`/${config.apiName}/species`)
      .set('Authorization', `Bearer ${token}`);
    return response.body.species[0].id;
  }

  static async getValidMushroomId(token) {
    const response = await supertest(app).get(`/${config.apiName}/mushrooms`)
      .set('Authorization', `Bearer ${token}`);
    return response.body.mushrooms[0].id;
  }

  static shuffleString(string) {
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

  static createPicture() {
    const imgsPath = path.resolve('src/data/images');
    const imgs = fs.readdirSync(imgsPath);
    const extension = imgs[0].split('.')[1];
    const imgBase64 = tobase64(`src/data/images/${imgs[0]}`, extension);
    return imgBase64;
  }
}
