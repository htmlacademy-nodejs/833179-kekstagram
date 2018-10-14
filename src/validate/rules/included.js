'use strict';

const included = {
  validator: (field, array) => array.includes(field),
  message: (field, value, array) => `Field '${field}' must be one of values: ${array.join(`, `)}. Now it's '${value}'`
};

module.exports = included;
