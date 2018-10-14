'use strict';

const port = process.argv[3];

const {runServer} = require(`../../app`);

const server = {
  name: `server`,
  description: `запускает сервер`,
  execute() {
    runServer(Number(port));
  }
};

module.exports = server;
