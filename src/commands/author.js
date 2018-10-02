'use strict';

const colors = require(`colors`);

const packageInfo = require(`../../package.json`);

const author = {
  name: `author`,
  description: `печатает имя автора приложения`,
  execute() {
    console.log(colors.bold(packageInfo.author));
  }
};

module.exports = author;
