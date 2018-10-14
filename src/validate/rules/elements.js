'use strict';

const elements = {
  validator: (array, customConfig) => array.every(customConfig.validator),
  message: (field, value, customConfig) =>
    customConfig.message(field, value.find((elem) => !customConfig.validator(elem))),
};

module.exports = elements;
