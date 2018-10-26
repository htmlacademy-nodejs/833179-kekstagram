'use strict';

const isFilename = require(`valid-filename`);

const path = {
  validator: (field) => isFilename(field),
  message: (field) => `Field ${field} must be a filename`
};

module.exports = path;
