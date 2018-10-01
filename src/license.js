'use strict';

const colors = require(`colors`);

const packageInfo = require(`../package.json`);

const license = {
  name: `license`,
  description: `печатает лицензию приложения`,
  execute() {
    console.log(colors.bgWhite.red(packageInfo.license));
  }
};

module.exports = license;
