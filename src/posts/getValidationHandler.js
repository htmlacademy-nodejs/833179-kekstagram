'use strict';

const BadRequestError = require(`../errors/BadRequestError`);
const NotFoundError = require(`../errors/NotFoundError`);
const validate = require(`../validate/index`);
const {
  DATE_MIN,
  DATE_MAX,
} = require(`../generateEntitySettings`);

const config = {
  date: [
    `required`,
    `numeric`,
    [`minValue`, DATE_MIN],
    [`maxValue`, DATE_MAX],
  ],
};

const getValidationHandler = (posts, date) => {
  const errors = validate(config, {date});

  if (errors) {
    const firstInvalidField = Object.values(errors)[0];
    throw new BadRequestError(firstInvalidField[0]);
  }

  const entity = posts.find((item) => item.date === Number(date));

  if (!entity) {
    throw new NotFoundError(`An entity with date ${date} is not found`);
  }

  return entity;
};

module.exports = getValidationHandler;
