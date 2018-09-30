'use strict';

const packageInfo = require(`./package.json`);
const commandData = require(`./src/index`);

const input = process.argv[2];
const isFlag = (command) => command && command.substring(0, 2) === `--`;
const formatFlagToCommand = (command) => command.substr(2);

if (!input) {
  console.log(`Привет пользователь!\nЭта программа будет запускать сервер «${packageInfo.name}».\nАвтор: ${packageInfo.author}.`);
  process.exit(0);
} else if (isFlag(input) && commandData[formatFlagToCommand(input)]) {
  commandData[formatFlagToCommand(input)].execute();
  process.exit(0);
}

console.log(`Неизвестная команда ${input}. Для использования приложения используйте команды:`);
commandData.help.execute();
process.exit(1);
