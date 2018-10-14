'use strict';

const required = {
  validator: (field) => Array.isArray(field),
  message: (field) => `Field ${field} must be an array`
};

module.exports = required;
