'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);
const multer = require(`multer`);

const postRouter = new Router();
const upload = multer();

const getValidationHandler = require(`./getValidationHandler`);
const postValidationHandler = require(`./postValidationHandler`);

const {
  ENTITY_LENGTH,
  DEFAULT_LIMIT,
  DEFAULT_SKIP,
} = require(`./settings`);

const generateEntity = require(`./../generateEntity`);
const {newArray} = require(`../utils`);

const posts = newArray(ENTITY_LENGTH).map(() => generateEntity());

postRouter.get(``, (req, res) => {
  const isLimited = req.query.limit &&
    Number.isInteger(Number(req.query.limit)) &&
    Number(req.query.limit) > 0 &&
    Number(req.query.limit) < ENTITY_LENGTH;
  const isSkipped = req.query.skip &&
    Number.isInteger(Number(req.query.skip)) &&
    Number(req.query.skip) > 0 &&
    Number(req.query.skip) < (isLimited ? Number(req.query.limit) : ENTITY_LENGTH);
  const requestedEntities = posts
    .slice(0, isLimited ? Number(req.query.limit) : DEFAULT_LIMIT)
    .slice(isSkipped ? Number(req.query.skip) : DEFAULT_SKIP);

  res.json(requestedEntities);
});

postRouter.get(`/:date`, asyncHandler(async (req, res) => {
  const date = req.params.date;

  res.json(getValidationHandler(posts, date));
}));

postRouter.post(``, upload.none(), (req, res) => {
  const body = req.body;

  res.send(postValidationHandler(body));
});

module.exports = postRouter;
