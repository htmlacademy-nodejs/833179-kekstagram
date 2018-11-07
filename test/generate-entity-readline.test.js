'use strict';

const assert = require(`assert`);

const {
  askAmountOfEntitiesCb,
  askFileNameCb,
  writeGeneretedDataToFile,
} = require(`../src/generate-entity-readline`);
const generateEntity = require(`../src/generate-entity`);

const {
  doesFileExist,
  readFile,
  unlinkFile,
} = require(`../src/utils`);

describe(`generateEntityReadline`, () => {
  describe(`#askAmountOfEntitiesCb`, () => {
    const answer = (input) => new Promise(
        (resolve, reject) => askAmountOfEntitiesCb(resolve, reject)(input)
    );

    it(`should reject if nothing passed'`, async () => {
      await answer(``).catch(() => assert.ok(true));
    });
    it(`should reject if non-numeric input passed'`, async () => {
      await answer(`a`).catch(() => assert.ok(true));
      await answer(`-`).catch(() => assert.ok(true));
      await answer(`$`).catch(() => assert.ok(true));
      await answer(`2px`).catch(() => assert.ok(true));
    });
    it(`should reject if zero or negative value passed'`, async () => {
      await answer(`0`).catch(() => assert.ok(true));
      await answer(`-2`).catch(() => assert.ok(true));
    });
    it(`should reject if double passed'`, async () => {
      await answer(`2.2`).catch(() => assert.ok(true));
    });
    it(`should resolve if integer passed'`, async () => {
      await answer(`2`).then(() => assert.ok(true));
      await answer(`20`).then(() => assert.ok(true));
      await answer(`02`).then(() => assert.ok(true));
      await answer(`2.0`).then(() => assert.ok(true));
    });
    it(`should pass object with 'entityCount' if resolved`, async () => {
      const entityCount = `3`;
      const callbackOutput = await answer(entityCount);

      assert.equal(callbackOutput.entityCount, entityCount);
    });
    it(`should pass nothing if rejected`, async () => {
      const callbackOutput = await answer(`a`)
        .catch((response) => response);

      assert.equal(callbackOutput, undefined);
    });
  });
  describe(`#askFileNameCb`, () => {
    const passedData = {entityCount: 1};
    const answer = (input) => new Promise(
        (resolve, reject) => askFileNameCb(passedData)(resolve, reject)(input)
    );

    it(`should reject if filename with non-existing directory passed'`, async () => {
      await answer(`/some/random/path/file.json`).catch(() => assert.ok(true));
    });

    it(`should reject if filename with non-accessible directory passed'`, async () => {
      await answer(`/file.json`).catch(() => assert.ok(true));
    });

    it(`should resolve if filename with existing and accessible directory passed'`, async () => {
      await answer(`${__dirname}/file.json`).then(() => assert.ok(true));
    });
    it(`should pass object with 'entityCount' if rejected`, async () => {
      const callbackOutput = await answer(`/file.json`)
        .catch((response) => response);

      assert.equal(callbackOutput.entityCount, passedData.entityCount);
    });
    it(`should pass object with 'entityCount', 'fileName' and 'isExistingFile' if resolved`, async () => {
      const callbackOutput = await answer(`${__dirname}/file.json`);

      assert.ok(Object.keys(callbackOutput).includes(`entityCount`));
      assert.ok(Object.keys(callbackOutput).includes(`fileName`));
      assert.ok(Object.keys(callbackOutput).includes(`isExistingFile`));
    });
    it(`should pass the same 'entityCount' and 'fileName' it got`, async () => {
      const fileName = `${__dirname}/file.json`;
      const callbackOutput = await answer(fileName);

      assert.equal(callbackOutput.entityCount, passedData.entityCount);
      assert.equal(callbackOutput.fileName, fileName);
    });
    it(`should pass "'isExistingFile': false" if filename is a path to non-existing yet file`, async () => {
      const callbackOutput = await answer(`${__dirname}/file.json`);

      assert.ok(!callbackOutput.isExistingFile);
    });
    it(`should pass "'isExistingFile': true" if filename is a path to existing file`, async () => {
      const callbackOutput = await answer(__filename);

      assert.ok(callbackOutput.isExistingFile);
    });
  });
  describe(`#writeGeneretedDataToFile`, () => {
    const passedData = {entityCount: 1, fileName: `${__dirname}/file.json`};
    const writeFile = () => writeGeneretedDataToFile(passedData);
    const writeAndDeleteFile = async (callback) => {
      await writeFile();

      const fileContent = await readFile(passedData.fileName)
        .then((content) => JSON.parse(content));

      callback(fileContent);

      await unlinkFile(passedData.fileName);
    };

    it(`should write file with path specified in 'fileName'`, async () => {
      assert.ok(!doesFileExist(passedData.fileName));

      await writeAndDeleteFile(() => {
        assert.ok(doesFileExist(passedData.fileName));
      });

      assert.ok(!doesFileExist(passedData.fileName));
    });
    it(`should write file with amount of entities specified in 'entityCount'`, async () => {
      await writeAndDeleteFile((fileContent) => {
        assert.equal(fileContent.length, passedData.entityCount);
      });
    });
    it(`should write file with structure of object given by 'generateEntity' function`, async () => {
      await writeAndDeleteFile((fileContent) => {
        assert.deepEqual(Object.keys(fileContent[0]), Object.keys(generateEntity()));
      });
    });
  });
});
