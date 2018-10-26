'use strict';

const express = require(`express`);
const asyncHandler = require(`express-async-handler`);
const multer = require(`multer`);

const Router = express.Router;
const postRouter = new Router();
const upload = multer();
const jsonParser = express.json();
const toStream = require(`buffer-to-stream`);

const BadRequestError = require(`../errors/BadRequestError`);
const NotFoundError = require(`../errors/NotFoundError`);
const {
  getOneValidationHandler,
  getAllValidationHandler,
} = require(`./getValidationHandler`);
const postValidationHandler = require(`./postValidationHandler`);
const {
  DEFAULT_LIMIT,
  DEFAULT_SKIP,
} = require(`./settings`);

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

postRouter.get(``, asyncHandler(async (req, res) => {
  const limit = req.query.limit || DEFAULT_LIMIT;
  const skip = req.query.skip || DEFAULT_SKIP;

  try {
    await getAllValidationHandler({skip, limit});
  } catch (error) {
    throw new BadRequestError(error);
  }

  res.send(await toPage(await postRouter.postsStore.getAllPosts(), Number(skip), Number(limit)));
}));

postRouter.get(`/:date`, asyncHandler(async (req, res) => {
  const date = req.params.date;

  try {
    await getOneValidationHandler(date);
  } catch (error) {
    throw new BadRequestError(error);
  }

  const entity = await postRouter.postsStore.getPost(date);

  if (!entity) {
    throw new NotFoundError(`An entity with date ${date} is not found`);
  }

  res.send(entity);
}));

postRouter.get(`/:date/image`, asyncHandler(async (req, res) => {
  const date = req.params.date;

  try {
    await getOneValidationHandler(date);
  } catch (error) {
    throw new BadRequestError(error);
  }

  const entity = await postRouter.postsStore.getPost(date);

  if (!entity) {
    throw new NotFoundError(`An entity with date ${date} is not found`);
  }

  const image = await postRouter.imageStore.get(entity._id);

  if (!image) {
    throw new NotFoundError(`An image for post with date ${date} is not found`);
  }

  res.header(`Content-Type`, `image/jpeg`);
  res.header(`Content-Length`, image.info.length);

  res.on(`error`, (e) => console.error(e));
  res.on(`end`, () => res.end());

  const stream = image.stream;
  stream.on(`error`, (e) => console.error(e));
  stream.on(`end`, () => res.end());
  stream.pipe(res);
}));

postRouter.post(``, jsonParser, upload.single(`image`), asyncHandler(async (req, res) => {
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

  const result = await postRouter.postsStore.save(body);
  const insertedId = result.insertedId;

  if (image) {
    await postRouter.imageStore.save(insertedId, toStream(image.buffer));
  }

  res.send(body);
}));

module.exports = (postsStore, imagesStore) => {
  postRouter.postsStore = postsStore;
  postRouter.imageStore = imagesStore;
  return postRouter;
};
