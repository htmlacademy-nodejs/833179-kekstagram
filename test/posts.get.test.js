'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);

const generateEntity = require(`../src/generate-entity`);

const postsStoreMock = require(`./mock/posts-store-mock`);
const imagesStoreMock = require(`./mock/images-store-mock`);
const postsRoute = require(`../src/posts/route`)(postsStoreMock, imagesStoreMock);

const errorHandler = require(`../src/errors/error-handler`);
const notFoundErrorHandler = require(`../src/errors/not-found-error-handler`);

const app = express();

app.use(`/api/posts`, postsRoute);

app.use(notFoundErrorHandler);
app.use(errorHandler);

const {
  DATE_MIN,
  DATE_MAX,
  DEFAULT_LIMIT,
  DEFAULT_SKIP,
  ENTITY_LENGTH,
} = require(`../src/posts/settings`);

const {
  CODE_BAD_REQUEST,
  CODE_NOT_FOUND,
} = require(`../src/errors/codes`);

describe(`GET /api/posts`, () => {
  describe(`/`, () => {
    it(`should get successful response code`, () => {
      return request(app)
        .get(`/api/posts`)
        .expect(200);
    });
    it(`should get response in HTML format, if 'accept' contains 'text/html'`, () => {
      return request(app)
        .get(`/api/posts`)
        .set(`Accept`, `text/html`)
        .expect(`Content-Type`, /html/);
    });
    it(`should get response in JSON format in all other cases`, () => {
      return request(app)
        .get(`/api/posts`)
        .expect(`Content-Type`, /json/);
    });
    it(`should get posts with structure of object given by 'generateEntity' function`, async () => {
      const response = await request(app).get(`/api/posts`);

      assert.deepEqual(Object.keys(response.body.data[0]), Object.keys(generateEntity()));
    });
    it(`should get posts with default length if limit and skip are not specified`, async () => {
      const response = await request(app).get(`/api/posts`);

      assert.equal(response.body.data.length, DEFAULT_LIMIT);
    });
    it(`should get posts with specified length (limit) if it's less than default`, async () => {
      const limit = DEFAULT_LIMIT - 1;
      const length = limit - DEFAULT_SKIP;
      const response = await request(app)
        .get(`/api/posts`)
        .query({limit});

      assert.equal(response.body.data.length, length);
    });
    it(`should get posts with specified length (limit) despite skip value`, async () => {
      const req1skip = 0;
      const req2skip = 1;
      const limit = 5;
      const response1 = await request(app)
        .get(`/api/posts`)
        .query({limit, skip: req1skip});
      const response2 = await request(app)
        .get(`/api/posts`)
        .query({limit, skip: req2skip});

      assert.equal(response1.body.data.length, response2.body.data.length);
    });
    it(`should get posts with indexes from 0 to limit`, async () => {
      const skip = 0;
      const req1limit = 5;
      const req2limit = ENTITY_LENGTH;
      const response1 = await request(app)
        .get(`/api/posts`)
        .query({limit: req1limit, skip});
      const response2 = await request(app)
        .get(`/api/posts`)
        .query({limit: req2limit, skip});

      assert.deepEqual(
          response1.body.data,
          response2.body.data.slice(0, req1limit)
      );
    });
  });
  describe(`/:date`, () => {
    it(`should get successful response code`, async () => {
      const allPosts = await request(app).get(`/api/posts`);

      return request(app)
        .get(`/api/posts/${allPosts.body.data[0].date}`)
        .expect(200);
    });
    it(`should get response in HTML format, if 'accept' contains 'text/html'`, async () => {
      const allPosts = await request(app).get(`/api/posts`);

      return request(app)
        .get(`/api/posts/${allPosts.body.data[0].date}`)
        .set(`Accept`, `text/html`)
        .expect(`Content-Type`, /html/);
    });
    it(`should get response in JSON format in all other cases`, async () => {
      const allPosts = await request(app).get(`/api/posts`);

      return request(app)
        .get(`/api/posts/${allPosts.body.data[0].date}`)
        .expect(`Content-Type`, /json/);
    });
    it(`should get post with structure of object given by 'generateEntity' function`, async () => {
      const allPosts = await request(app).get(`/api/posts`);
      const response = await request(app).get(`/api/posts/${allPosts.body.data[0].date}`);

      assert.deepEqual(Object.keys(response.body), Object.keys(generateEntity()));
    });
    it(`should get post with specified date`, async () => {
      const index = 0;
      const allPosts = await request(app).get(`/api/posts`);
      const response = await request(app).get(`/api/posts/${allPosts.body.data[index].date}`);

      assert.deepEqual(allPosts.body.data[index], response.body);
    });
    it(`should get response code with 400 if date is invalid`, () => {
      return request(app)
        .get(`/api/posts/invalidDateFormat`)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should get response code with 400 if date is less than DATE_MIN`, () => {
      return request(app)
        .get(`/api/posts/${DATE_MIN - 1}`)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should get response code with 400 if date is more than DATE_MAX`, () => {
      return request(app)
        .get(`/api/posts/${DATE_MAX + 1}`)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should get response code with 404 if there is no an entity with such a date`, async () => {
      const allPosts = await request(app).get(`/api/posts`);

      return request(app)
        .get(`/api/posts/${allPosts.body.data[0].date - 1}`) // actually it may fail, but probability is very low
        .expect(CODE_NOT_FOUND);
    });
  });
});
