'use strict';

const validate = require(`../validate/index`);

const getOneValidationHandler = (date) => new Promise((resolve, reject) => {
  const config = {
    date: [
      `required`,
      `numeric`,
    ],
  };

  const errors = validate(config, {date});

  if (errors) {
    const firstInvalidField = Object.values(errors)[0];
    reject(firstInvalidField[0]);
  }

  resolve();
});

const getAllValidationHandler = (params) => new Promise((resolve, reject) => {
  const config = {
    limit: [
      `numeric`,
      [`minValue`, 0],
    ],
    skip: [
      `numeric`,
      [`minValue`, 0],
    ],
  };

  const errors = validate(config, params);

  if (errors) {
    const firstInvalidField = Object.values(errors)[0];
    reject(firstInvalidField[0]);
  }

  resolve();
});

module.exports = {
  getOneValidationHandler,
  getAllValidationHandler,
};
