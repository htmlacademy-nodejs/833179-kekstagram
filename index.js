'use strict';

const input = process.argv[2];
const commandData = {
  '--version': `v1.0.0`,
  '--help': `Доступные команды:\n--help    — печатает этот текст;\n--version — печатает версию приложения;`,
};

if (!input) {
  console.log(`Привет пользователь!\nЭта программа будет запускать сервер «Кекстаграмм».\nАвтор: Кекс.`);
  process.exit(0);
} else if (commandData[input]) {
  console.log(commandData[input]);
  process.exit(0);
}

console.log(`Неизвестная команда ${input}. Чтобы прочитать правила использования приложения, наберите "--help"`);
process.exit(1);
