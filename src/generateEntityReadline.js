'use strict';

const fs = require(`fs`);
const path = require(`path`);

const utils = require(`./utils`);
const generateEntity = require(`./generateEntity`);

const askToGenerateEntity =
  () => utils.askClosedQuestion(`Привет пользователь!\nХотите получить сгенерированные данные? [Y/n]\n`)()
    .then(
        askAmountOfEntities,
        () => {
          console.log(`Bye`);
          utils.rl.close();
        }
    );

const askAmountOfEntities =
  (input, isInvalidResponse = false) => new Promise((resolve, reject) => {
    utils.rl.question(
        !isInvalidResponse ? `Сколько элементов создать?\n` : `Не понимаю, нужно число.\n`,
        (entityCount) => {
          if (Number.isNaN(Number(entityCount))) {
            reject();
            return;
          }

          resolve({entityCount});
        }
    );
  })
    .then(
        askPathToSave,
        (response) => askAmountOfEntities(response, true)
    );

const askPathToSave =
  (data, isInvalidResponse = false) => new Promise((resolve, reject) => {
    utils.rl.question(
        !isInvalidResponse
          ? `Укажите путь к файлу, в который необходимо сохранить сгенерированные данные\n`
          : `Невозможно создать файл, укажите другой путь\n`,
        (pathName) => {
          if (!utils.isDirectoryAccessible(path.dirname(pathName))) {
            reject(data);
            return;
          } else if (fs.existsSync(pathName) && fs.lstatSync(pathName).isFile()) {
            resolve(Object.assign(data, {pathName, isExistingFile: true}));
            return;
          }

          resolve(Object.assign(data, {pathName}));
        }
    );
  })
    .then(
        (response) => response.isExistingFile
          ? askToRewriteExistingFile(response)
          : writeGeneretedDataToFile(response),
        (response) => askPathToSave(response, true)
    );

const askToRewriteExistingFile =
  (data) => utils.askClosedQuestion(`По указанному пути уже есть файл, перезаписать его? [Y/n]\n`)(data)
    .then(
        (response) => writeGeneretedDataToFile(response),
        (response) => askPathToSave(response)
    );

const writeGeneretedDataToFile =
  (data) => new Promise((resolve, reject) => {
    const generatedData = JSON.stringify(utils.newArray(Number(data.entityCount)).map(() => generateEntity()));

    fs.writeFile(data.pathName, generatedData, (err) => {
      if (err) {
        reject(data);
        return;
      }

      console.log(`Файл сохранён успешно!`);
      utils.rl.close();
    });
  })
    .catch((response) => askPathToSave(response, true));

module.exports = () => askToGenerateEntity();
