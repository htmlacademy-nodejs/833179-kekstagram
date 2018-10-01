'use strict';

const colors = require(`colors`);

const packageInfo = require(`../package.json`);

const [majorVersion, minorVersion, patchVersion] = packageInfo.version.split(`.`);
const version = {
  name: `version`,
  description: `печатает версию приложения`,
  execute() {
    console.log(`v${colors.red(majorVersion)}.${colors.green(minorVersion)}.${colors.blue(patchVersion)}`);
  }
};

module.exports = version;
