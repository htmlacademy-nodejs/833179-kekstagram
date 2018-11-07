'use strict';

const asyncHandler = require(`express-async-handler`);
const prettyHtml = require(`json-pretty-html`).default;

const logger = require(`../../logger`);
const BadRequestError = require(`../../errors/bad-request-error`);
const NotFoundError = require(`../../errors/not-found-error`);
const {getOneValidationHandler} = require(`../get-validation-handler`);
const {isHTML, prettyHtmlSettings} = require(`../../utils`);

module.exports = (router) => {
  router.get(`/:date`, asyncHandler(async (req, res) => {
    const date = req.params.date;

    try {
      await getOneValidationHandler(date);
    } catch (error) {
      throw new BadRequestError(error);
    }

    const entity = await router.postsStore.getPost(date);

    if (!entity) {
      throw new NotFoundError(`An entity with date ${date} is not found`);
    }

    res
      .type(isHTML(req) ? `html` : `json`)
      .send(isHTML(req) ? prettyHtml(entity, prettyHtmlSettings) : entity);
  }));

  router.get(`/:date/image`, asyncHandler(async (req, res) => {
    const date = req.params.date;

    try {
      await getOneValidationHandler(date);
    } catch (error) {
      throw new BadRequestError(error);
    }

    const entity = await router.postsStore.getPost(date);

    if (!entity) {
      throw new NotFoundError(`An entity with date ${date} is not found`);
    }

    const image = await router.imageStore.get(entity._id);

    if (!image) {
      throw new NotFoundError(`An image for post with date ${date} is not found`);
    }

    res.header(`Content-Type`, `image/jpeg`);
    res.header(`Content-Length`, image.info.length);

    res.on(`error`, (e) => logger.error(e));
    res.on(`end`, () => res.end());

    const stream = image.stream;
    stream.on(`error`, (e) => logger.error(e));
    stream.on(`end`, () => res.end());
    stream.pipe(res);
  }));
};
