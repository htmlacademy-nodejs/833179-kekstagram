'use strict';

const {CODE_NOT_FOUND} = require(`./codes`);

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = CODE_NOT_FOUND;
  }
}

module.exports = NotFoundError;
