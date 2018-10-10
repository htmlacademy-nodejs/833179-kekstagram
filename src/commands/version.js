'use strict';

const colors = require(`colors`);

const packageInfo = require(`../../package.json`);

const [majorVersion, minorVersion, patchVersion] = packageInfo.version.split(`.`);
const version = {
  name: `version`,
  description: `печатает версию приложения`,
  execute() {
    console.log(`v${colors.red(majorVersion)}.${colors.green(minorVersion)}.${colors.blue(patchVersion)}`);
    process.exit(0);
  }
};

module.exports = version;
