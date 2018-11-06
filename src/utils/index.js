'use strict';

const {
  contentTypes,
  doesFileExist,
  isDirectoryAccessible,
  readFile,
  unlinkFile,
  writeFile,
} = require(`./fs`);
const {
  newArray,
  removeDupicateStringsFromArray,
} = require(`./js`);
const {
  askClosedQuestion,
  askClosedQuestionCb,
  closeRl,
  rlp,
} = require(`./rl`);

module.exports = {
  askClosedQuestion,
  askClosedQuestionCb,
  closeRl,
  contentTypes,
  doesFileExist,
  isDirectoryAccessible,
  newArray,
  readFile,
  removeDupicateStringsFromArray,
  rlp,
  unlinkFile,
  writeFile,
};
