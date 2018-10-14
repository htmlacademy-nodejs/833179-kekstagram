'use strict';

const request = require(`supertest`);
const assert = require(`assert`);

const {CODE_BAD_REQUEST} = require(`../src/errors/codes`);

const {app} = require(`../app`);
const {
  SCALE_MIN,
  SCALE_MAX,
  DESCRIPTION_MAX,
  HASHTAG_ELEMENT_MAX,
  HASHTAG_STRING_MAX,
} = require(`../src/generateEntitySettings`);
const {newArray} = require(`../src/utils`);

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
    it(`should fail if no scale`, async () => {
      const body = {
        effect: `none`,
      };

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`effect`, body.effect)
        .expect(CODE_BAD_REQUEST);

      await request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if scale is not numeric`, async () => {
      const body = {
        scale: `abc`,
        effect: `none`,
      };

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`effect`, body.effect)
        .field(`scale`, body.scale)
        .expect(CODE_BAD_REQUEST);

      await request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if scale is less than SCALE_MIN`, async () => {
      const body = {
        scale: SCALE_MIN - 1,
        effect: `none`,
      };

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`effect`, body.effect)
        .field(`scale`, body.scale)
        .expect(CODE_BAD_REQUEST);

      await request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if scale is more than SCALE_MAX`, async () => {
      const body = {
        scale: SCALE_MAX + 1,
        effect: `none`,
      };

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`effect`, body.effect)
        .field(`scale`, body.scale)
        .expect(CODE_BAD_REQUEST);

      await request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if no effect`, async () => {
      const body = {
        scale: 50,
      };

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`scale`, body.scale)
        .expect(CODE_BAD_REQUEST);

      await request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if effect is not one of predefined values`, async () => {
      const body = {
        scale: 50,
        effect: `someRandomValue`,
      };

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`effect`, body.effect)
        .field(`scale`, body.scale)
        .expect(CODE_BAD_REQUEST);

      await request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if description length is longer than DESCRIPTION_MAX`, async () => {
      const body = {
        scale: 50,
        effect: `none`,
        description: newArray(DESCRIPTION_MAX + 1).fill(`a`).join(``),
      };

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`effect`, body.effect)
        .field(`scale`, body.scale)
        .field(`scale`, body.description)
        .expect(CODE_BAD_REQUEST);

      await request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if amount of hashtags is more than HASHTAG_ELEMENT_MAX`, async () => {
      const body = {
        scale: 50,
        effect: `none`,
        hashtags: newArray(HASHTAG_ELEMENT_MAX + 1).fill(`a`),
      };

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`effect`, body.effect)
        .field(`scale`, body.scale)
        .field(`hashtags[]`, body.hashtags)
        .expect(CODE_BAD_REQUEST);

      await request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if an element of hashtags array has more characters than HASHTAG_STRING_MAX`, async () => {
      const body = {
        scale: 50,
        effect: `none`,
        hashtags: [newArray(HASHTAG_STRING_MAX + 1).fill(`a`).join(``)],
      };

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`effect`, body.effect)
        .field(`scale`, body.scale)
        .field(`hashtags[]`, body.hashtags)
        .expect(CODE_BAD_REQUEST);

      await request(app)
        .post(`/api/posts`)
        .send(body)
        .expect(CODE_BAD_REQUEST);
    });
  });
});
