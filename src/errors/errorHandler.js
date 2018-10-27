'use strict';

const {CODE_INTERNAL_ERROR} = require(`./codes`);

const logger = require(`../logger`);

const errorHandler = (err, req, res, _next) => {
  if (err) {
    const isInternalError = !err.code;

    if (isInternalError) {
      logger.error(err);
    }

    res
      .status(isInternalError ? CODE_INTERNAL_ERROR : err.code)
      .send(isInternalError ? `Internal server error` : err.message);
  }
};

module.exports = errorHandler;
