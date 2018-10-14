'use strict';

const required = {
  validator: (field) => Number.isInteger(Number(field)),
  message: (field) => `Field ${field} must be numeric`
};

module.exports = required;
