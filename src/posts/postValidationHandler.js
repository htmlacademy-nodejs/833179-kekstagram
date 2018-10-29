'use strict';

const {removeDupicateStringsFromArray} = require(`../utils`);
const validate = require(`../validate/index`);
const {
  SCALE_MIN,
  SCALE_MAX,
  EFFECT_VALUES,
  DESCRIPTION_MAX,
  HASHTAG_ELEMENT_MAX,
  HASHTAG_STRING_MAX,
} = require(`../generateEntitySettings`);

const postValidationHandler = (data) => new Promise((resolve, reject) => {
  const config = {
    'filename': [
      `required`,
      `image`,
    ],
    'effect-level': [
      `required`,
      `numeric`,
      [`minValue`, SCALE_MIN],
      [`maxValue`, SCALE_MAX],
    ],
    'effect': [
      `required`,
      [`included`, EFFECT_VALUES],
    ],
    'description': [
      [`max`, DESCRIPTION_MAX],
    ],
    'hashtags': [
      // max hashtag amount
      [`custom`, {
        validator: (string) => string.split(` `).length <= HASHTAG_ELEMENT_MAX,
        message: () => `There can not be more than ${HASHTAG_ELEMENT_MAX} hashtags`,
      }],
      // every hashtag starts with '#'
      [`custom`, {
        validator: (string) => string.split(` `).every((elem) => elem[0] === `#`),
        message: () => `All hashtags must begin with '#'`,
      }],
      // max hashtag length
      [`custom`, {
        validator: (string) => string.split(` `).every((elem) => elem.length <= HASHTAG_STRING_MAX),
        message: () => `All hashtags must contain ${HASHTAG_STRING_MAX} or less characters`,
      }],
      // all hashtags are unique
      [`custom`, {
        validator: (string) => string.split(` `).filter(removeDupicateStringsFromArray).length === string.split(` `).length,
        message: () =>`There can not be duplicated hashtags`,
      }],
    ],
  };

  const errors = validate(config, data);

  if (errors) {
    const firstInvalidField = Object.values(errors)[0];
    reject(firstInvalidField[0]);
  }

  resolve();
});

module.exports = postValidationHandler;
