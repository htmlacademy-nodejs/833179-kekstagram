'use strict';

const {json} = require(`express`);
const multer = require(`multer`);
const asyncHandler = require(`express-async-handler`);
const toStream = require(`buffer-to-stream`);
const prettyHtml = require(`json-pretty-html`).default;
const {isHTML, prettyHtmlSettings} = require(`../../utils`);

const {
  DEFAULT_LIMIT,
  DEFAULT_SKIP,
} = require(`../settings`);

const BadRequestError = require(`../../errors/bad-request-error`);
const {getAllValidationHandler} = require(`../get-validation-handler`);
const postValidationHandler = require(`../post-validation-handler`);

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

const createPostData = (body) => {
  const date = Date.now();
  const url = `/api/posts/${date}/image`;
  const hashtags = body.hashtags && body.hashtags.split(` `).map((hashtag) => hashtag.substr(1));
  const scale = Number(body[`effect-level`]);
  const likes = 0;
  const comments = [];
  const effect = body.effect;
  const description = body.description;

  return {
    url,
    description,
    effect,
    hashtags,
    comments,
    likes,
    scale,
    date,
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

    const data = await toPage(await router.postsStore.getAllPosts(), Number(skip), Number(limit));

    res
      .type(isHTML(req) ? `html` : `json`)
      .send(isHTML(req) ? prettyHtml(data, prettyHtmlSettings) : data);
  }));

  router.post(``, jsonParser, upload.single(`filename`), asyncHandler(async (req, res) => {
    const body = req.body;

    body.filename = req.file && req.file.buffer;

    try {
      await postValidationHandler(body);
    } catch (error) {
      throw new BadRequestError(error);
    }

    const data = createPostData(body);
    const result = await router.postsStore.save(data);
    const insertedId = result.insertedId;

    await router.imageStore.save(insertedId, toStream(body.filename));

    res.send(data);
  }));
};
