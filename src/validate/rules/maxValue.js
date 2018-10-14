'use strict';

const maxValue = {
  validator: (field, value) => field <= value,
  message: (field, fieldValue, value) => `Field ${field} must be equal or less than ${value}. Now it's ${fieldValue}`
};

module.exports = maxValue;
