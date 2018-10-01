'use strict';

const packageInfo = require(`../package.json`);

const description = {
  name: `description`,
  description: `печатает описание приложения`,
  execute() {
    console.log(packageInfo.description);
  }
};

module.exports = description;
