'use strict';

const request = require(`supertest`);
const assert = require(`assert`);

const {app} = require(`../app`);

const {CODE_BAD_REQUEST} = require(`../src/errors/codes`);

describe(`POST /api/posts`, () => {
  describe(`/`, () => {
    it(`should send back the same json-object`, async () => {
      const body = {
        scale: 50,
        effect: `none`,
        hashtags: [`#gathsah`],
        description: `Test post`,
      };

      const response = await request(app)
        .post(`/api/posts`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `application/json`)
        .send(body);

      assert.deepEqual(body, response.body);
    });
    it(`should send back json-object with the same form-data fields`, async () => {
      const body = {
        scale: 50,
        effect: `none`,
        hashtags: [`#gathsah`],
        description: `Test post`,
      };

      const response = await request(app)
        .post(`/api/posts`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`scale`, body.scale)
        .field(`effect`, body.effect)
        .field(`hashtags[]`, body.hashtags)
        .field(`description`, body.description);

      assert.equal(body.scale, response.body.scale);
      assert.equal(body.effect, response.body.effect);
      assert.deepEqual(body.hashtags, response.body.hashtags);
      assert.equal(body.description, response.body.description);
    });
    it(`should fail if no scale`, () => {
      const body = {
        effect: `none`,
      };

      return request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if no effect`, () => {
      const body = {
        scale: 50,
      };

      return request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
  });
});
