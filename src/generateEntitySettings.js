'use strict';

module.exports = {
  SCALE_MIN: 0,
  SCALE_MAX: 100,
  EFFECT_VALUES: [`none`, `chrome`, `sepia`, `marvin`, `phobos`, `heat`],
  HASHTAG_ELEMENT_MIN: 0,
  HASHTAG_ELEMENT_MAX: 5,
  HASHTAG_STRING_MAX: 20,
  DESCRIPTION_MAX: 140,
  LIKES_MIN: 0,
  LIKES_MAX: 1000,
  COMMENTS_ELEMENT_MIN: 0,
  COMMENTS_ELEMENT_MAX: 10,
  COMMENTS_STRING_MAX: 140,
  DATE_MIN: Date.now() - (60 * 60 * 24 * 7 * 1000),
  DATE_MAX: Date.now(),
};
