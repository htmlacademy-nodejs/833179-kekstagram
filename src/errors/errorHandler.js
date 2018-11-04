'use strict';

const {CODE_INTERNAL_ERROR} = require(`./codes`);

const logger = require(`../logger`);

const errorHandler = (err, req, res, _next) => {
  if (err) {
    const isInternalError = !err.code;
    const status = isInternalError ? CODE_INTERNAL_ERROR : err.code;
    const errors = isInternalError ? `Internal server error` : err.errors || err.message;

    if (isInternalError) {
      logger.error(err);
    }

    res.status(status).json({errors});
  }
};

module.exports = errorHandler;
