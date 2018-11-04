'use strict';

const packageInfo = require(`./package.json`);

require(`dotenv`).config();

const commandData = require(`./src/commands/index`);

const input = process.argv[2];
const isFlag = (command) => command && command.substring(0, 2) === `--`;
const formatFlagToCommand = (command) => command.substr(2);
const logDefault = (phrase) => {
  console.log(`${phrase} Для использования приложения используйте команды:`);
  commandData.help.execute();
};

if (!input) {
  logDefault(`Привет пользователь!\nТебя приветствует приложение ${packageInfo.name}.`);
  process.exit(0);
} else if (isFlag(input) && commandData[formatFlagToCommand(input)]) {
  commandData[formatFlagToCommand(input)].execute();
} else {
  logDefault(`Неизвестная команда ${input}.`);
  process.exit(1);
}
