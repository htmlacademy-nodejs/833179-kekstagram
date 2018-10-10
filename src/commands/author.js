'use strict';

const colors = require(`colors`);

const packageInfo = require(`../../package.json`);

const author = {
  name: `author`,
  description: `печатает имя автора приложения`,
  execute() {
    console.log(colors.bold(packageInfo.author));
    process.exit(0);
  }
};

module.exports = author;
