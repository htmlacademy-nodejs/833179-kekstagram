'use strict';

const packageInfo = require(`../package.json`);

const version = {
  name: `version`,
  description: `печатает версию приложения`,
  execute() {
    console.log(`v${packageInfo.version}`);
  }
};

module.exports = version;
