'use strict';

const db = require(`../database/db`);
const mongodb = require(`mongodb`);

class ImageStore {
  async get(filename) {
    const bucket = await this._getBucket();
    const results = await (bucket).find({filename}).toArray();

    const entity = results[0];

    return entity
      ? {info: entity, stream: bucket.openDownloadStreamByName(filename)}
      : null;
  }

  async save(filename, stream) {
    const bucket = await this._getBucket();

    return new Promise((resolve, reject) => {
      stream
        .pipe(bucket.openUploadStream(filename))
        .on(`error`, reject)
        .on(`finish`, resolve);
    });
  }

  async _getBucket() {
    if (this._bucket) {
      return this._bucket;
    }

    const dBase = await db;
    this._bucket = new mongodb.GridFSBucket(dBase, {
      chunkSizeBytes: 512 * 1024,
      bucketName: `images`
    });

    return this._bucket;
  }
}

module.exports = new ImageStore();
