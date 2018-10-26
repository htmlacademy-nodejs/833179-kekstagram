'use strict';

const DEFAULT_PORT = 3000;

const express = require(`express`);
const bodyParser = require(`body-parser`);

const app = express();
const postsStore = require(`./src/posts/postsStore`);
const imagesStore = require(`./src/posts/imagesStore`);
const postRouter = require(`./src/posts/route`);

const errorHandler = require(`./src/errors/errorHandler`);
const notFoundErrorHandler = require(`./src/errors/notFoundErrorHandler`);

app.use(express.static(`static`));
app.use(bodyParser.json());
app.use(`/api/posts/`, postRouter(postsStore, imagesStore));

app.use(notFoundErrorHandler);
app.use(errorHandler);

const runServer = (customPort) => {
  const port = customPort && Number.isInteger(customPort) ? customPort : DEFAULT_PORT;

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
};

module.exports = {
  app,
  runServer,
};
