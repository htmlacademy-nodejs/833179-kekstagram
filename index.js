'use strict';

const commandData = require(`./src/commands/index`);
const generateEntity = require(`./src/generateEntityReadline`).askToGenerateEntityHandler;

const input = process.argv[2];
const isFlag = (command) => command && command.substring(0, 2) === `--`;
const formatFlagToCommand = (command) => command.substr(2);

if (!input) {
  generateEntity();
} else if (isFlag(input) && commandData[formatFlagToCommand(input)]) {
  commandData[formatFlagToCommand(input)].execute();
  process.exit(0);
} else {
  console.log(`Неизвестная команда ${input}. Для использования приложения используйте команды:`);
  commandData.help.execute();
  process.exit(1);
}
