'use strict';

const packageInfo = require(`../package.json`);

const license = {
  name: `license`,
  description: `печатает лицензию приложения`,
  execute() {
    console.log(packageInfo.license);
  }
};

module.exports = license;
