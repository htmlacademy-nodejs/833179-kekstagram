'use strict';

const path = require(`path`);

const {
  askClosedQuestion,
  closeRl,
  doesFileExist,
  isDirectoryAccessible,
  newArray,
  rlp,
  writeFile,
} = require(`./utils`);
const generateEntity = require(`./generate-entity`);

const askToGenerateEntityHandler =
  (...args) => askToGenerateEntity(...args)
    .then(
        askAmountOfEntitiesHandler,
        closeRl(`Bye`)
    );

const askToGenerateEntity =
  () => askClosedQuestion(`Привет пользователь!\nХотите получить сгенерированные данные? [Y/n]\n`);

const askAmountOfEntitiesHandler =
  (...args) => askAmountOfEntities(...args)
    .then(
        askFileNameHandler,
        () => askAmountOfEntitiesHandler(true)
    );

const askAmountOfEntities =
  (isInvalidResponse = false) => rlp(
      !isInvalidResponse ? `Сколько элементов создать?\n` : `Не понимаю, нужно натуральное число.\n`,
      askAmountOfEntitiesCb,
  );

const askAmountOfEntitiesCb =
  (resolve, reject) => (entityCount) => Number.isInteger(Number(entityCount)) && Number(entityCount) > 0
    ? resolve({entityCount})
    : reject();

const askFileNameHandler =
  (...args) => askFileName(...args)
    .then(
        (response) => response.isExistingFile
          ? askToRewriteExistingFileHandler(response)
          : writeGeneretedDataToFileHandler(response),
        (response) => askFileNameHandler(response, true),
    );

const askFileName =
  (data, isInvalidResponse = false) => rlp(
      !isInvalidResponse
        ? `Укажите путь к файлу, в который необходимо сохранить сгенерированные данные\n`
        : `Невозможно создать файл, укажите другой путь\n`,
      askFileNameCb(data),
  );

const askFileNameCb =
  (data) => (resolve, reject) => (fileName) => isDirectoryAccessible(path.dirname(fileName))
    ? resolve(Object.assign(
        {},
        data,
        {
          fileName,
          isExistingFile: doesFileExist(fileName)
        }
    ))
    : reject(data);

const askToRewriteExistingFileHandler =
  (...args) => askToRewriteExistingFile(...args)
    .then(
        (response) => writeGeneretedDataToFileHandler(response),
        (response) => askFileNameHandler(response),
    );

const askToRewriteExistingFile =
  (data) => askClosedQuestion(`По указанному пути уже есть файл, перезаписать его? [Y/n]\n`, data);

const writeGeneretedDataToFileHandler =
  (...args) => writeGeneretedDataToFile(...args)
    .then(
        closeRl(`Файл сохранён успешно!`),
        (response) => askFileNameHandler(response, true),
    );

const writeGeneretedDataToFile =
  (data) => writeFile(
      data.fileName,
      JSON.stringify(newArray(Number(data.entityCount)).map(() => generateEntity())),
      data
  );

module.exports = {
  askAmountOfEntitiesCb,
  askAmountOfEntitiesHandler,
  askFileNameCb,
  askFileNameHandler,
  askToGenerateEntityHandler,
  askToRewriteExistingFileHandler,
  writeGeneretedDataToFile,
  writeGeneretedDataToFileHandler,
};
