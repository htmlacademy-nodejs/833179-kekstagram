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
  isHTML,
  prettyHtmlSettings,
} = require(`./http`);
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
  isHTML,
  newArray,
  prettyHtmlSettings,
  readFile,
  removeDupicateStringsFromArray,
  rlp,
  unlinkFile,
  writeFile,
};
