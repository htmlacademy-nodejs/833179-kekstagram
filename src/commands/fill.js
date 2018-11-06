'use strict';

const generateEntity = require(`../../src/generate-entity-readline`).askToGenerateEntityHandler;

const fill = {
  name: `fill`,
  description: `генерирует данные api/post`,
  execute() {
    generateEntity();
  }
};

module.exports = fill;

