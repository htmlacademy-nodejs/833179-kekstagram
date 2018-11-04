'use strict';

const generateEntity = require(`../../src/generateEntityReadline`).askToGenerateEntityHandler;

const fill = {
  name: `fill`,
  description: `генерирует данные api/post`,
  execute() {
    generateEntity();
  }
};

module.exports = fill;

