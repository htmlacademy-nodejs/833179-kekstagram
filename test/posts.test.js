'use strict';

const request = require(`supertest`);
const assert = require(`assert`);

const {app} = require(`../app`);

const generateEntity = require(`../src/generateEntity`);

const {
  ENTITY_LENGTH,
  DEFAULT_LIMIT,
  DEFAULT_SKIP,
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
    it(`should get response in JSON format`, () => {
      return request(app)
        .get(`/api/posts`)
        .expect(`Content-Type`, /json/);
    });
    it(`should get posts with structure of object given by 'generateEntity' function`, async () => {
      const response = await request(app).get(`/api/posts`);

      assert.deepEqual(Object.keys(response.body[0]), Object.keys(generateEntity()));
    });
    it(`should get posts with default length if limit and skip are not specified`, async () => {
      const defeultLength = DEFAULT_LIMIT - DEFAULT_SKIP;
      const response = await request(app).get(`/api/posts`);

      assert.equal(response.body.length, defeultLength);
    });
    it(`should get posts with specified length (limit) if it's less than default`, async () => {
      const limit = DEFAULT_LIMIT - 1;
      const length = limit - DEFAULT_SKIP;
      const response = await request(app)
        .get(`/api/posts`)
        .query({limit});

      assert.equal(response.body.length, length);
    });
    it(`should get posts with default length (limit) if it's more than entity length`, async () => {
      const limit = ENTITY_LENGTH + 1;
      const length = DEFAULT_LIMIT - DEFAULT_SKIP;
      const response = await request(app)
        .get(`/api/posts`)
        .query({limit});

      assert.equal(response.body.length, length);
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
          response1.body,
          response2.body.slice(0, req1limit)
      );
    });
    it(`should skip posts with specified amount`, async () => {
      const skip = 1;
      const length = DEFAULT_LIMIT - skip;
      const response = await request(app)
        .get(`/api/posts`)
        .query({skip});

      assert.equal(response.body.length, length);
    });
    it(`should get posts with indexes from skip to 5`, async () => {
      const req1skip = 1;
      const req2skip = 0;
      const limit = 5;
      const response1 = await request(app)
        .get(`/api/posts`)
        .query({limit, skip: req1skip});
      const response2 = await request(app)
        .get(`/api/posts`)
        .query({limit, skip: req2skip});

      assert.deepEqual(
          response1.body,
          response2.body.slice(req1skip)
      );
    });
  });
  describe(`/:date`, () => {
    it(`should get successful response code`, async () => {
      const allPosts = await request(app).get(`/api/posts`);

      return request(app)
        .get(`/api/posts/${allPosts.body[0].date}`)
        .expect(200);
    });
    it(`should get response in JSON format`, async () => {
      const allPosts = await request(app).get(`/api/posts`);

      return request(app)
        .get(`/api/posts/${allPosts.body[0].date}`)
        .expect(`Content-Type`, /json/);
    });
    it(`should get post with structure of object given by 'generateEntity' function`, async () => {
      const allPosts = await request(app).get(`/api/posts`);
      const response = await request(app).get(`/api/posts/${allPosts.body[0].date}`);

      assert.deepEqual(Object.keys(response.body), Object.keys(generateEntity()));
    });
    it(`should get post with specified date`, async () => {
      const index = 0;
      const allPosts = await request(app).get(`/api/posts`);
      const response = await request(app).get(`/api/posts/${allPosts.body[index].date}`);

      assert.deepEqual(allPosts.body[index], response.body);
    });
    it(`should get response code with bad request if date is invalid`, () => {
      return request(app)
        .get(`/api/posts/invalidDateFormat`)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should get response code with bad request if date is invalid`, () => {
      return request(app)
        .get(`/api/posts/1`)
        .expect(CODE_NOT_FOUND);
    });
  });
});
