'use strict';

const assert = require(`assert`);

const {askClosedQuestionCb} = require(`../src/utils`);

describe(`utils-rl`, () => {
  describe(`#askClosedQuestionCb`, () => {
    const answer = (input, data) => new Promise(
        (resolve, reject) => askClosedQuestionCb(data)(resolve, reject)(input)
    );

    it(`should resolve if input is 'y' or 'yes'`, async () => {
      await answer(`y`).then(() => assert.ok(true));
      await answer(`yes`).then(() => assert.ok(true));
    });
    it(`should reject if input is 'n', 'no' or other string except of 'y' or 'yes'`, async () => {
      await answer(`n`).catch(() => assert.ok(true));
      await answer(`no`).catch(() => assert.ok(true));
      await answer(`random`).catch(() => assert.ok(true));
      await answer(``).catch(() => assert.ok(true));
    });
    it(`should pass data (if contains it) when resolved`, async () => {
      const data = `data`;
      const callbackOutput = await answer(`y`, data);

      assert.equal(callbackOutput, data);
    });
    it(`should pass data (if contains it) when rejected`, async () => {
      const data = `data`;
      const callbackOutput = await answer(`n`, data)
        .catch((response) => response);

      assert.equal(callbackOutput, data);
    });
    it(`should pass undefined if no input data`, async () => {
      const callbackOutputResolved = await answer(`y`);
      const callbackOutputRejected = await answer(`n`)
        .catch((response) => response);

      assert.equal(callbackOutputResolved, undefined);
      assert.equal(callbackOutputRejected, undefined);
    });
  });
});
