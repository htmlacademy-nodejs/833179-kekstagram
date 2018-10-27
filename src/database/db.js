'use strict';

const {
  DB_HOST,
  DB_PORT,
  DB_NAME
} = process.env;

const {MongoClient} = require(`mongodb`);

const url = `mongodb://${DB_HOST}:${DB_PORT}`;

module.exports = MongoClient
  .connect(url)
  .then((client) => client.db(DB_NAME))
  .catch((e) => {
    console.error(`Failed to connect to MongoDB`, e);
    process.exit(1);
  });
