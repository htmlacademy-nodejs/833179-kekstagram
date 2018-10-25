'use strict';

require(`dotenv`).config();
const {MongoClient} = require(`mongodb`);

const url = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;

module.exports = MongoClient
  .connect(url)
  .then((client) => client.db(`kekstagram`))
  .catch((e) => {
    console.error(`Failed to connect to MongoDB`, e);
    process.exit(1);
  });
