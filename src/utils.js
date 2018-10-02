'use strict';

const removeDupicateStringsFromArray = (item, index, array) => {
  return array.indexOf(item.toLowerCase()) === index;
};

module.exports = {
  removeDupicateStringsFromArray,
};
