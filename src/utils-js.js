'use strict';

const newArray = (count) => [...(new Array(count))];

const removeDupicateStringsFromArray = (item, index, array) => {
  return array.indexOf(item.toLowerCase()) === index;
};

module.exports = {
  newArray,
  removeDupicateStringsFromArray,
};
