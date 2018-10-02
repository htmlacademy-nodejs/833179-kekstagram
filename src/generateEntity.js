'use strict';

const loremIpsum = require(`lorem-ipsum`).loremIpsum;

const utils = require(`../src/utils.js`);

const generateEntitySettings = require(`./generateEntitySettings`);

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
  const hashtagAmount = getRandomNumber(
      generateEntitySettings.HASHTAG_ELEMENT_MIN,
      generateEntitySettings.HASHTAG_ELEMENT_MAX
  );

  return !hashtagAmount
    ? []
    : loremIpsum({
      count: hashtagAmount,
      units: `words`,
    })
      .split(` `)
      .filter(utils.removeDupicateStringsFromArray)
      .filter((word) => word.length <= generateEntitySettings.HASHTAG_STRING_MAX)
      .map((word) => word.substr(0, 1) === `#` ? word : `#${word}`);
};
const getComments = () => {
  const commentsAmount = getRandomNumber(
      generateEntitySettings.COMMENTS_ELEMENT_MIN,
      generateEntitySettings.COMMENTS_ELEMENT_MAX
  );

  return [...(new Array(commentsAmount))]
    .map(() => getRandomText(2, generateEntitySettings.COMMENTS_STRING_MAX));
};

module.exports = () => ({
  url: `https://picsum.photos/600/?random`,
  scale: getRandomNumber(generateEntitySettings.SCALE_MIN, generateEntitySettings.SCALE_MAX),
  effect: generateEntitySettings.EFFECT_VALUES[getRandomNumber(0, generateEntitySettings.EFFECT_VALUES.length)],
  hashtags: getHashTags(),
  description: getRandomText(2, generateEntitySettings.DESCRIPTION_MAX),
  likes: getRandomNumber(generateEntitySettings.LIKES_MIN, generateEntitySettings.LIKES_MAX),
  comments: getComments(),
  date: getRandomNumber(generateEntitySettings.DATE_MIN, generateEntitySettings.DATE_MAX),
});
