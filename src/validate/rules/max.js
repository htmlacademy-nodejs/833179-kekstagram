'use strict';

const max = {
  validator: (field, value) => field.length <= value,
  message: (field, fieldValue, value) =>
    `Field ${field} must contain ${value} or less characters. Now it's ${fieldValue.length}`
};

module.exports = max;
