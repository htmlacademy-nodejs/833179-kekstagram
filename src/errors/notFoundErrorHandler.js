'use strict';

const {CODE_NOT_FOUND} = require(`./codes`);

const notFoundErrorHandler = (req, res) => {
  res
    .status(CODE_NOT_FOUND)
    .send(`Page is not found`);
};

module.exports = notFoundErrorHandler;
