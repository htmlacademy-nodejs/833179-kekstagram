'use strict';

const isHTML = (req) => /html/.test(req.headers.accept);

const prettyHtmlSettings = {
  length: 7.0,
  width: 12.0,
  height: 9.5,
};

module.exports = {
  isHTML,
  prettyHtmlSettings,
};
