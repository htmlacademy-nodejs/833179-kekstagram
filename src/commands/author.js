'use strict';

const packageInfo = require(`../../package.json`);

const author = {
  name: `author`,
  description: `печатает имя автора приложения`,
  execute() {
    console.log(packageInfo.author);
    process.exit(0);
  }
};

module.exports = author;
