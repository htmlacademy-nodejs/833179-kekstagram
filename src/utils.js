'use strict';

const {
  doesFileExist,
  isDirectoryAccessible,
  readFile,
  unlinkFile,
  writeFile,
} = require(`./utils-fs`);
const {
  newArray,
  removeDupicateStringsFromArray,
} = require(`./utils-js`);
const {
  askClosedQuestion,
  askClosedQuestionCb,
  closeRl,
  rlp,
} = require(`./utils-rl`);

module.exports = {
  askClosedQuestion,
  askClosedQuestionCb,
  closeRl,
  doesFileExist,
  isDirectoryAccessible,
  newArray,
  readFile,
  removeDupicateStringsFromArray,
  rlp,
  unlinkFile,
  writeFile,
};
