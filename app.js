'use strict';

const DEFAULT_PORT = 3000;

const express = require(`express`);
const postRouter = require(`./src/posts/route`);
const app = express();

const errorHandler = require(`./src/errors/errorHandler`);
const notFoundErrorHandler = require(`./src/errors/notFoundErrorHandler`);

app.use(express.static(`static`));
app.use(`/api/posts/`, postRouter);

postRouter.use(notFoundErrorHandler);
postRouter.use(errorHandler);

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
