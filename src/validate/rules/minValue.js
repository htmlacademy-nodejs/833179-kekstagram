'use strict';

const minValue = {
  validator: (field, value) => field >= value,
  message: (field, fieldValue, value) => `Field ${field} must be equal or more than ${value}. Now it's ${fieldValue}`
};

module.exports = minValue;
