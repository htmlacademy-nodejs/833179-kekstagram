'use strict';

const required = {
  validator: (field) => field !== undefined,
  message: (field) => `Field ${field} is required`
};

module.exports = required;
