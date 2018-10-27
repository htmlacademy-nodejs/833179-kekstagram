'use strict';

const elements = {
  validator: (field, {validator}) => validator(field),
  message: (field, {message}) => message(field),
};

module.exports = elements;
