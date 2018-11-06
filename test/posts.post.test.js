'use strict';

const request = require(`supertest`);
const express = require(`express`);

const postsStoreMock = require(`./mock/posts-store-mock`);
const imagesStoreMock = require(`./mock/images-store-mock`);
const postsRoute = require(`../src/posts/route`)(postsStoreMock, imagesStoreMock);

const {CODE_BAD_REQUEST} = require(`../src/errors/codes`);

const {
  SCALE_MIN,
  SCALE_MAX,
  DESCRIPTION_MAX,
  HASHTAG_ELEMENT_MAX,
  HASHTAG_STRING_MAX,
} = require(`../src/generate-entity-settings`);
const {newArray} = require(`../src/utils`);

const errorHandler = require(`../src/errors/error-handler`);
const notFoundErrorHandler = require(`../src/errors/not-found-error-handler`);

const app = express();

app.use(`/api/posts`, postsRoute);

app.use(notFoundErrorHandler);
app.use(errorHandler);

// Sending an image in 'filename' field of POST request to '/api/posts' is required,
// therefore a request in JSON format is not valid and will always fail.
// And although it can accept data in this format, testing it is not possible

describe(`POST /api/posts`, () => {
  describe(`/`, () => {
    it(`should fail if no filename`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .field(`effect`, `none`)
        .field(`effect-level`, 50)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if filename is not a valid image`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/text.txt`)
        .field(`effect`, `none`)
        .field(`effect-level`, 50)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should pass if filename is a valid image`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `none`)
        .field(`effect-level`, 50)
        .expect(200);

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpeg`)
        .field(`effect`, `none`)
        .field(`effect-level`, 50)
        .expect(200);

      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.png`)
        .field(`effect`, `none`)
        .field(`effect-level`, 50)
        .expect(200);
    });
    it(`should fail if no effect-level`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `none`)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if effect-level is not numeric`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `none`)
        .field(`effect-level`, `abc`)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if effect-level is less than SCALE_MIN`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `none`)
        .field(`effect-level`, SCALE_MIN - 1)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if effect-level is more than SCALE_MAX`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `none`)
        .field(`effect-level`, SCALE_MAX + 1)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if no effect`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect-level`, 50)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if effect is not one of predefined values`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `someRandomValue`)
        .field(`effect-level`, 50)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if description length is longer than DESCRIPTION_MAX`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `none`)
        .field(`effect-level`, 50)
        .field(`description`, newArray(DESCRIPTION_MAX + 1).fill(`a`).join(``))
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if amount of hashtags is more than HASHTAG_ELEMENT_MAX`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `none`)
        .field(`effect-level`, 50)
        .field(`hashtags`, newArray(HASHTAG_ELEMENT_MAX + 1).fill(`#a`).join(` `))
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if hashtag doesn't begin with #`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `none`)
        .field(`effect-level`, 50)
        .field(`hashtags`, `a`)
        .expect(CODE_BAD_REQUEST);
    });
    it(`should fail if an element of hashtags array has more characters than HASHTAG_STRING_MAX`, async () => {
      await request(app)
        .post(`/api/posts`)
        .set(`Content-Type`, `multipart/form-data`)
        .attach(`filename`, `test/assets/image.jpg`)
        .field(`effect`, `none`)
        .field(`effect-level`, 50)
        .field(`hashtags`, `#${newArray(HASHTAG_STRING_MAX + 1).fill(`a`).join(``)}`)
        .expect(CODE_BAD_REQUEST);
    });
  });
});
