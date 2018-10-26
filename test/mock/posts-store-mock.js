'use strict';

const Cursor = require(`./cursor-mock`);
const generateEntity = require(`../../src/generateEntity`);
const {newArray} = require(`./../../src/utils`);
const {ENTITY_LENGTH} = require(`./../../src/posts/settings.js`);

class PostStoreMock {
  constructor(data) {
    this.data = data;
  }

  async getPost(date) {
    return this.data.find((post) => post.date === Number(date));
  }

  async getAllPosts() {
    return new Cursor(this.data);
  }

  async save(post) {
    this.data = [
      ...this.data,
      post,
    ];

    return this.data;
  }
}

module.exports = new PostStoreMock(newArray(ENTITY_LENGTH).map(() => generateEntity()));
