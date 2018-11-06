'use strict';

const {runServer} = require(`../../app`);

const port = process.argv[3];

const server = {
  name: `server`,
  description: `запускает сервер`,
  execute() {
    runServer(Number(port));
  }
};

module.exports = server;
