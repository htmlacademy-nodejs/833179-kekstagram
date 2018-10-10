'use strict';

const http = require(`http`);
const fs = require(`fs`);
const path = require(`path`);

const {
  contentTypes,
  isDirectoryAccessible,
  doesFileExist,
} = require(`./src/utils`);

const getFileNametoPost = (url) => {
  const fileName = url === `/`
    ? `./static/index.html`
    : `./static${url}`;

  return (isDirectoryAccessible(path.dirname(fileName)) && doesFileExist(fileName))
    ? fileName
    : null;
};

const runServer = (port) => {
  const hostname = `127.0.0.1`;

  const server = http.createServer(async (req, res) => {
    const url = req.url;
    const fileName = getFileNametoPost(url);

    if (!fileName) {
      res.statusCode = 404;
      res.end();
      return;
    }

    const fileExtension = path.extname(fileName).substr(1);
    const fileContentType = contentTypes[fileExtension];
    const stream = fs.createReadStream(fileName);

    stream.on(`open`, () => {
      res.statusCode = 200;
      res.setHeader(`Content-Type`, fileContentType);
      stream.pipe(res);
    });
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });

  server.on(`error`, (e) => {
    console.log(e);
  });
};

module.exports = runServer;
