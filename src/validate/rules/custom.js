'use strict';

const elements = {
  validator: (field, {validator}) => validator(field),
  message: (field, fieldValue, {message}) => message(field, fieldValue),
};

module.exports = elements;
