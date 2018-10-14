'use strict';

const {CODE_INTERNAL_ERROR} = require(`./codes`);

const errorHandler = (err, req, res, _next) => {
  if (err) {
    console.error(err);
    res
      .status(err.code || CODE_INTERNAL_ERROR)
      .send(err.code ? err.message : `Internal server error`);
  }
};

module.exports = errorHandler;
