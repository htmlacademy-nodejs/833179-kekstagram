'use strict';

const {
  SERVER_PORT,
  SERVER_HOST
} = process.env;

const express = require(`express`);
const bodyParser = require(`body-parser`);

const app = express();
const postsStore = require(`./src/posts/postsStore`);
const imagesStore = require(`./src/posts/imagesStore`);
const postRouter = require(`./src/posts/route`);

const errorHandler = require(`./src/errors/errorHandler`);
const notFoundErrorHandler = require(`./src/errors/notFoundErrorHandler`);

const logger = require(`./src/logger`);

app.use(express.static(`static`));
app.use(bodyParser.json());
app.use(`/api/posts/`, postRouter(postsStore, imagesStore));

app.use(notFoundErrorHandler);
app.use(errorHandler);

const runServer = (customPort) => {
  const port = customPort && Number.isInteger(customPort) ? customPort : SERVER_PORT;

  app.listen(port, () => {
    logger.info(`Server running at http://${SERVER_HOST}${port}/`);
  });
};

module.exports = {
  app,
  runServer,
};
