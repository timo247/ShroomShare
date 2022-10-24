import supertest from 'supertest';
import app from '../app.js';
import config from '../config.js';

export let userToken = '';// eslint-disable-line
export let adminToken = '';// eslint-disable-line

export const setTokens = async () => {
  const res1 = await supertest(app)
    .post(`/${config.apiName}/auth`)
    .send(userCredentials);
  userToken = res1.body.token;
  if (!userToken) throw new Error('Can\'t set user\'s token');
  const res2 = await supertest(app)
    .post(`/${config.apiName}/auth`)
    .send(adminCredentials);
  adminToken = res2.body.token;
  if (!adminToken) throw new Error('Can\'t set admin\'s token');
};

export const apiCall = async ({ method, path, body, messageWrapper, token } = {}) => { // eslint-disable-line
  const response = await supertest(app)[method](`/${config.apiName}/${path}`)
    .send(body)
    .set('Authorization', `Bearer ${token}`)
    .expect(messageWrapper.status)
    .expect('Content-Type', /json/);
  return response;
};

export const getValidUserId = async (token) => {
  const response = await supertest(app).get(`/${config.apiName}/users`)
    .set('Authorization', `Bearer ${token}`);
  return response.body.users[0].id;
};

export const adminCredentials = {
  username: 'user02',
  password: 'password02',
};

export const userCredentials = {
  username: 'user01',
  password: 'password01',
};