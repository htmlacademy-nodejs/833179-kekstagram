'use strict';

const {json} = require(`express`);
const multer = require(`multer`);
const asyncHandler = require(`express-async-handler`);
const toStream = require(`buffer-to-stream`);

const {
  DEFAULT_LIMIT,
  DEFAULT_SKIP,
} = require(`../settings`);

const BadRequestError = require(`../../errors/BadRequestError`);
const {getAllValidationHandler} = require(`../getValidationHandler`);
const postValidationHandler = require(`../postValidationHandler`);

const upload = multer();
const jsonParser = json();

const toPage = async (cursor, skip, limit) => {
  const packet = await cursor
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    data: packet,
    skip,
    limit,
    total: await cursor.count(),
  };
};

module.exports = (router) => {
  router.get(``, asyncHandler(async (req, res) => {
    const limit = req.query.limit || DEFAULT_LIMIT;
    const skip = req.query.skip || DEFAULT_SKIP;

    try {
      await getAllValidationHandler({skip, limit});
    } catch (error) {
      throw new BadRequestError(error);
    }

    res.send(await toPage(await router.postsStore.getAllPosts(), Number(skip), Number(limit)));
  }));

  router.post(``, jsonParser, upload.single(`image`), asyncHandler(async (req, res) => {
    const body = req.body;
    const image = req.file;

    if (image) {
      body.image = {name: image.originalname};
    }

    try {
      await postValidationHandler(body);
    } catch (error) {
      throw new BadRequestError(error);
    }

    const result = await router.postsStore.save(body);
    const insertedId = result.insertedId;

    if (image) {
      await router.imageStore.save(insertedId, toStream(image.buffer));
    }

    res.send(body);
  }));
};
