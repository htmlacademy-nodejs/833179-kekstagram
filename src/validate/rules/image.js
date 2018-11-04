'use strict';

const fileType = require(`file-type`);

const imageMimeTypes = [`image/jpg`, `image/png`, `image/jpeg`];

const path = {
  validator: (field) => imageMimeTypes.includes(fileType(field) && fileType(field).mime),
  message: (field) => `Value of the field ${field} must be an image`
};

module.exports = path;
