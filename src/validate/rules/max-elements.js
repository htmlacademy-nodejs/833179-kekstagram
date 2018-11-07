'use strict';

const maxElements = {
  validator: (array, value) => array.length <= value,
  message: (field, fieldValue, value) =>
    `Field ${field} must contain ${value} or less elements. Now it's ${fieldValue.length}`
};

module.exports = maxElements;
