'use strict';

const express = require(`express`);

const Router = express.Router;
const postRouter = new Router();

const corsRoute = require(`./cors`);
const defaultRoute = require(`./default`);
const dateRoute = require(`./date`);

corsRoute(postRouter);
defaultRoute(postRouter);
dateRoute(postRouter);

module.exports = (postsStore, imagesStore) => {
  postRouter.postsStore = postsStore;
  postRouter.imageStore = imagesStore;
  return postRouter;
};
