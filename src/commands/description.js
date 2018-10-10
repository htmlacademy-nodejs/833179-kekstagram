'use strict';

const colors = require(`colors`);

const packageInfo = require(`../../package.json`);

const description = {
  name: `description`,
  description: `печатает описание приложения`,
  execute() {
    console.log(colors.rainbow(packageInfo.description));
    process.exit(0);
  }
};

module.exports = description;
