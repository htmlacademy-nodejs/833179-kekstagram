'use strict';

const assert = require(`assert`);

const validUrl = require(`valid-url`);

const utils = require(`../src/utils.js`);

const generateEntity = require(`../src/generateEntity`);
const generateEntitySettings = require(`./../src/generateEntitySettings`);
const currentEntity = generateEntity();

const isString = (item) => typeof item === `string`;
const isHashTag = (item) => item.substr(0, 1) === `#`;
const hasSpaces = (item) => /\s/.test(item);
const isInRange = (max, min = 0) => (item) => item <= max && item >= min;
const isLengthInRange = (max, min = 0) => (item) => item.length <= max && item.length >= min;

describe(`generateEntity`, () => {
  describe(`#url`, () => {
    it(`should be string`, () => {
      assert.ok(isString(currentEntity.url));
    });
    it(`should be valid url`, () => {
      assert.ok(validUrl.isUri(currentEntity.url));
    });
  });
  describe(`#scale`, () => {
    it(`should be integer`, () => {
      assert.ok(Number.isInteger(currentEntity.scale));
    });
    it(`should be in a predefined range`, () => {
      assert.ok(isInRange(generateEntitySettings.SCALE_MAX, generateEntitySettings.SCALE_MIN)(currentEntity.scale));
    });
  });
  describe(`#effect`, () => {
    it(`should be string`, () => {
      assert.ok(isString(currentEntity.effect));
    });
    it(`should be one of predefined values`, () => {
      assert.ok(generateEntitySettings.EFFECT_VALUES.includes(currentEntity.effect));
    });
  });
  describe(`#hashtags`, () => {
    it(`should be an array`, () => {
      assert.ok(Array.isArray(currentEntity.hashtags));
    });
    it(`should contain limited amount of elements`, () => {
      assert.ok(isLengthInRange(generateEntitySettings.HASHTAG_ELEMENT_MAX)(currentEntity.hashtags));
    });
    it(`should contain only strings`, () => {
      assert.ok(currentEntity.hashtags.every(isString));
    });
    it(`should contain only strings first character of which is a hash`, () => {
      assert.ok(currentEntity.hashtags.every(isHashTag));
    });
    it(`should contain only words`, () => {
      assert.ok(!currentEntity.hashtags.some(hasSpaces));
    });
    it(`should contain non-repeating words`, () => {
      assert.ok(currentEntity.hashtags
        .filter(utils.removeDupicateStringsFromArray).length === currentEntity.hashtags.length);
    });
    it(`should contain words with limited amount of characters`, () => {
      assert.ok(currentEntity.hashtags.every(isLengthInRange(generateEntitySettings.HASHTAG_STRING_MAX)));
    });
  });
  describe(`#description`, () => {
    it(`should be string`, () => {
      assert.ok(isString(currentEntity.description));
    });
    it(`should be string with limited amount of characters`, () => {
      assert.ok(isLengthInRange(generateEntitySettings.DESCRIPTION_MAX)(currentEntity.description));
    });
  });
  describe(`#likes`, () => {
    it(`should be integer`, () => {
      assert.ok(Number.isInteger(currentEntity.likes));
    });
    it(`should be in a predefined range`, () => {
      assert.ok(isInRange(generateEntitySettings.LIKES_MAX, generateEntitySettings.LIKES_MIN)(currentEntity.likes));
    });
  });
  describe(`#comments`, () => {
    it(`should be an array`, () => {
      assert.ok(Array.isArray(currentEntity.comments));
    });
    it(`should contain limited amount of elements`, () => {
      assert.ok(isLengthInRange(generateEntitySettings.COMMENTS_ELEMENT_MAX)(currentEntity.comments));
    });
    it(`should contain only strings`, () => {
      assert.ok(currentEntity.comments.every(isString));
    });
    it(`should contain sentences with limited amount of characters`, () => {
      assert.ok(currentEntity.comments.every(isLengthInRange(generateEntitySettings.COMMENTS_STRING_MAX)));
    });
  });
  describe(`#date`, () => {
    it(`should be integer`, () => {
      assert.ok(Number.isInteger(currentEntity.date));
    });
    it(`should be in a predefined range`, () => {
      assert.ok(isInRange(generateEntitySettings.DATE_MAX, generateEntitySettings.DATE_MIN)(currentEntity.date));
    });
  });
});
