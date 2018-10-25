'use strict';

const loremIpsum = require(`lorem-ipsum`).loremIpsum;

const {newArray, removeDupicateStringsFromArray} = require(`../src/utils.js`);
const {
  COMMENTS_ELEMENT_MAX,
  COMMENTS_ELEMENT_MIN,
  COMMENTS_STRING_MAX,
  DATE_MAX,
  DATE_MIN,
  DESCRIPTION_MAX,
  EFFECT_VALUES,
  HASHTAG_ELEMENT_MAX,
  HASHTAG_ELEMENT_MIN,
  HASHTAG_STRING_MAX,
  LIKES_MAX,
  LIKES_MIN,
  SCALE_MAX,
  SCALE_MIN,
} = require(`./generateEntitySettings`);

const getRandomNumber = (from, to) => Math.floor(Math.random() * (to - from)) + from;
const getRandomText = (sentencesCount, characterLimit) => {
  const randomText = loremIpsum({
    count: sentencesCount,
    units: `sentences`,
  });

  return randomText.length <= characterLimit
    ? randomText
    : getRandomText(sentencesCount, characterLimit);
};

const getHashTags = () => {
  const hashtagAmount = getRandomNumber(HASHTAG_ELEMENT_MIN, HASHTAG_ELEMENT_MAX);

  return !hashtagAmount
    ? []
    : loremIpsum({
      count: hashtagAmount,
      units: `words`,
    })
      .split(` `)
      .filter(removeDupicateStringsFromArray)
      .filter((word) => word.length <= HASHTAG_STRING_MAX)
      .map((word) => word.substr(0, 1) === `#` ? word : `#${word}`);
};
const getComments = () => {
  const commentsAmount = getRandomNumber(COMMENTS_ELEMENT_MIN, COMMENTS_ELEMENT_MAX);

  return newArray(commentsAmount)
    .map(() => getRandomText(2, COMMENTS_STRING_MAX));
};

module.exports = () => ({
  image: `https://picsum.photos/600/?random`,
  scale: getRandomNumber(SCALE_MIN, SCALE_MAX),
  effect: EFFECT_VALUES[getRandomNumber(0, EFFECT_VALUES.length)],
  hashtags: getHashTags(),
  description: getRandomText(2, DESCRIPTION_MAX),
  likes: getRandomNumber(LIKES_MIN, LIKES_MAX),
  comments: getComments(),
  date: getRandomNumber(DATE_MIN, DATE_MAX),
});
