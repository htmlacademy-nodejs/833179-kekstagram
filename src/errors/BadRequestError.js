'use strict';

const {CODE_BAD_REQUEST} = require(`./codes`);

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.code = CODE_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
