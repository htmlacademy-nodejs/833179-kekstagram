'use strict';

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
    image: [
      `filename`,
    ],
    scale: [
      `required`,
      `numeric`,
      [`minValue`, SCALE_MIN],
      [`maxValue`, SCALE_MAX],
    ],
    effect: [
      `required`,
      [`included`, EFFECT_VALUES],
    ],
    description: [
      [`max`, DESCRIPTION_MAX],
    ],
    hashtags: [
      `array`,
      [`maxElements`, HASHTAG_ELEMENT_MAX],
      [`elements`, {
        validator: (hashtag) => hashtag.length <= HASHTAG_STRING_MAX,
        message: (field, fieldValue) =>
          `An element of ${field} must contain ${HASHTAG_STRING_MAX} or less characters. Now it's ${fieldValue.length}`,
      }]
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
