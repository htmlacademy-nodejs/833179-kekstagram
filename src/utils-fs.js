'use strict';

const fs = require(`fs`);
const {promisify} = require(`util`);

const contentTypes = {
  css: `text/css`,
  html: `text/html; charset=UTF-8`,
  jpg: `image/jpeg`,
  png: `image/png`,
  gif: `image/gif`,
  ico: `image/x-icon`,
};

const isDirectoryAccessible = (dirName) => {
  try {
    fs.accessSync(dirName, fs.constants.F_OK | fs.constants.W_OK | fs.constants.R_OK);

    return true;
  } catch (error) {
    return false;
  }
};

const doesFileExist = (fileName) => fs.existsSync(fileName) && fs.lstatSync(fileName).isFile();

const writeFile =
  (fileName, fileContent, data) => new Promise((resolve, reject) => fs.writeFile(
      fileName,
      fileContent,
      (err) => err ? reject(data) : resolve(data),
  ));

const readFile = (fileName) => promisify(fs.readFile)(fileName, `utf8`);

const unlinkFile =
  (fileName, data) => new Promise((resolve, reject) => fs.unlink(
      fileName,
      (err) => err ? reject(data) : resolve(data),
  ));

module.exports = {
  contentTypes,
  doesFileExist,
  isDirectoryAccessible,
  readFile,
  unlinkFile,
  writeFile,
};
