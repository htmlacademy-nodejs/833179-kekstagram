'use strict';

const rules = require(`./rules/index`);

const validate = (config, formData) => {
  const errors = {};

  for (const field in config) {
    if (!config.hasOwnProperty(field)) {
      continue;
    }

    const fieldRules = config[field];
    const fieldValue = formData[field];

    fieldRules.forEach((rule) => {
      const hasParams = Array.isArray(rule);
      const ruleName = hasParams ? rule[0] : rule;

      if (fieldValue === undefined && ruleName !== `required`) {
        return;
      }

      const isValid = rules[ruleName].validator(fieldValue, hasParams && rule[1]);

      if (!isValid) {
        const errorMessage = rules[ruleName].message(field, fieldValue, hasParams && rule[1]);

        if (errors[field]) {
          errors[field].push(errorMessage);
        } else {
          errors[field] = [errorMessage];
        }
      }
    });
  }

  const hasErrors = Object.keys(errors).length !== 0;

  return hasErrors ? errors : null;
};

module.exports = validate;
