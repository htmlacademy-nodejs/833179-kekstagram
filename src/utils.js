'use strict';

const fs = require(`fs`);
const readline = require(`readline`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const newArray = (count) => [...(new Array(count))];

const removeDupicateStringsFromArray = (item, index, array) => {
  return array.indexOf(item.toLowerCase()) === index;
};

const isDirectoryAccessible = (dirName) => {
  try {
    fs.accessSync(dirName, fs.constants.F_OK | fs.constants.W_OK | fs.constants.R_OK);

    return true;
  } catch (error) {
    return false;
  }
};

const isResponseAffirmative = (response) => response.toLowerCase() === `y` || response.toLowerCase() === `yes`;

const askClosedQuestion =
  (question) => (data) => new Promise((resolve, reject) => {
    rl.question(
        question,
        (response) => {
          if (!isResponseAffirmative(response)) {
            reject(data);
            return;
          }

          resolve(data);
        }
    );
  });

module.exports = {
  rl,
  newArray,
  removeDupicateStringsFromArray,
  isDirectoryAccessible,
  askClosedQuestion,
};
